package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodVersionRequest;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.exception.UnauthorizedException;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WodVersionService {

  private final WodVersionRepository wodVersionRepository;
  private final WodRepository wodRepository;
  private final CurrentUserService currentUserService;

  public WodVersionService(
      WodVersionRepository wodVersionRepository,
      WodRepository wodRepository,
      CurrentUserService currentUserService) {
    this.wodVersionRepository = wodVersionRepository;
    this.wodRepository = wodRepository;
    this.currentUserService = currentUserService;
  }

  public List<WodVersion> findAll() {
    return wodVersionRepository.findAll().stream()
        .filter(this::canAccess)
        .toList();
  }

  public WodVersion findById(Long id) {
    WodVersion version = wodVersionRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Versión de WOD no encontrada"));
    if (!canAccess(version)) {
      if (version.getWod().getOrigin() == WodOrigin.PERSONAL
          && currentUserService.find().isEmpty()) {
        throw new UnauthorizedException("Autenticación requerida");
      }
      throw new ForbiddenException("No tienes permisos para acceder a esta versión");
    }
    return version;
  }

  public WodVersion create(WodVersionRequest request) {
    Wod wod = requireOwnedWod(request.wodId());
    int versionNumber = wodVersionRepository
        .findTopByWodIdOrderByVersionNumberDesc(wod.getId())
        .map(version -> version.getVersionNumber() + 1)
        .orElse(1);
    return wodVersionRepository.save(new WodVersion(
        wod,
        versionNumber,
        request.type(),
        request.timeCapSeconds(),
        request.rounds()));
  }

  public void deleteById(Long id) {
    requireOwnedVersion(id);
    wodVersionRepository.deleteById(id);
  }

  public WodVersion requireOwnedVersion(Long id) {
    WodVersion version = wodVersionRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Versión de WOD no encontrada"));
    if (!isOwnedPersonal(version.getWod()) || version.getWod().getDeletedAt() != null) {
      throw new ForbiddenException("No tienes permisos para modificar esta versión");
    }
    return version;
  }

  private Wod requireOwnedWod(Long id) {
    Wod wod = wodRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("WOD no encontrado"));
    if (!isOwnedPersonal(wod) || wod.getDeletedAt() != null) {
      throw new ForbiddenException("No tienes permisos para modificar este WOD");
    }
    return wod;
  }

  private boolean canAccess(WodVersion version) {
    Wod wod = version.getWod();
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
