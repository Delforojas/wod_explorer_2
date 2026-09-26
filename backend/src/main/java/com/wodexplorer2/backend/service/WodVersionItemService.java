package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodVersionItemRequest;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WodVersionItemService {

  private final WodVersionItemRepository wodVersionItemRepository;
  private final WodVersionRepository wodVersionRepository;
  private final ExerciseRepository exerciseRepository;
  private final CurrentUserService currentUserService;

  public WodVersionItemService(
      WodVersionItemRepository wodVersionItemRepository,
      WodVersionRepository wodVersionRepository,
      ExerciseRepository exerciseRepository,
      CurrentUserService currentUserService) {
    this.wodVersionItemRepository = wodVersionItemRepository;
    this.wodVersionRepository = wodVersionRepository;
    this.exerciseRepository = exerciseRepository;
    this.currentUserService = currentUserService;
  }

  public List<WodVersionItem> findAll() {
    return wodVersionItemRepository.findAll().stream()
        .filter(this::canAccess)
        .toList();
  }

  public WodVersionItem findById(Long id) {
    WodVersionItem item = wodVersionItemRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Elemento de WOD no encontrado"));
    if (!canAccess(item)) {
      if (item.getWodVersion().getWod().getOrigin() == WodOrigin.PERSONAL
          && currentUserService.find().isEmpty()) {
        throw new UnauthorizedException("Autenticación requerida");
      }
      throw new ForbiddenException("No tienes permisos para acceder a este elemento");
    }
    return item;
  }

  public WodVersionItem create(WodVersionItemRequest request, Long wodVersionId) {
    WodVersion version = requireOwnedVersion(wodVersionId);
    Exercise exercise = exerciseRepository.findByIdAndActiveTrue(request.exerciseId())
        .orElseThrow(() -> new ResourceNotFoundException("Ejercicio no encontrado"));
    return wodVersionItemRepository.save(new WodVersionItem(
        version,
        exercise,
        request.position(),
        request.reps(),
        request.weightKg(),
        request.distanceM(),
        request.durationSeconds()));
  }

  public void deleteById(Long id) {
    WodVersionItem item = findById(id);
    if (!isOwnedPersonal(item.getWodVersion().getWod())) {
      throw new ForbiddenException("No tienes permisos para modificar este elemento");
    }
    wodVersionItemRepository.deleteById(id);
  }

  private WodVersion requireOwnedVersion(Long id) {
    WodVersion version = wodVersionRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Versión de WOD no encontrada"));
    if (!isOwnedPersonal(version.getWod()) || version.getWod().getDeletedAt() != null) {
      throw new ForbiddenException("No tienes permisos para modificar esta versión");
    }
    return version;
  }

  private boolean canAccess(WodVersionItem item) {
    Wod wod = item.getWodVersion().getWod();
    return (wod.getOrigin() == WodOrigin.GENERIC && wod.getDeletedAt() == null)
        || (wod.getDeletedAt() == null && isOwnedPersonal(wod));
  }

  private boolean isOwnedPersonal(Wod wod) {
    return currentUserService.find()
        .map(user -> wod.getOrigin() == WodOrigin.PERSONAL
            && wod.getOwner() != null
            && wod.getOwner().getId().equals(user.getId()))
        .orElse(false);
  }
}
