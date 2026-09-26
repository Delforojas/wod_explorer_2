package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.dto.WodRequest;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class WodService {

  private final WodRepository wodRepository;
  private final CurrentUserService currentUserService;

  public WodService(
      WodRepository wodRepository,
      CurrentUserService currentUserService) {
    this.wodRepository = wodRepository;
    this.currentUserService = currentUserService;
  }

  public List<Wod> findVisible() {
    List<Wod> visible = new java.util.ArrayList<>(
        wodRepository.findVisibleByOrigin(WodOrigin.GENERIC));
    currentUserService.find().ifPresent(user -> visible.addAll(
        wodRepository.findVisibleByOwnerAndOrigin(user.getId(), WodOrigin.PERSONAL)));
    return visible;
  }

  public Wod findVisibleById(Long id) {
    Wod wod = findById(id);
    if (wod.getOrigin() == WodOrigin.GENERIC && wod.getDeletedAt() == null) {
      return wod;
    }
    User current = currentUserService.require();
    if (isOwnedPersonal(wod, current) && wod.getDeletedAt() == null) {
      return wod;
    }
    throw new ForbiddenException("No tienes permisos para acceder a este WOD");
  }

  public Wod create(WodRequest request) {
    return wodRepository.save(new Wod(
        currentUserService.require(),
        request.name(),
        WodOrigin.PERSONAL));
  }

  public Wod update(Long id, WodRequest request) {
    Wod existingWod = requireOwnedPersonal(id);
    existingWod.update(request.name());

    return wodRepository.save(existingWod);
  }

  public void archive(Long id) {
    Wod existingWod = requireOwnedPersonal(id);
    existingWod.archive();
    wodRepository.save(existingWod);
  }

  public Wod requireOwnedPersonal(Long id) {
    Wod wod = findById(id);
    if (!isOwnedPersonal(wod, currentUserService.require()) || wod.getDeletedAt() != null) {
      throw new ForbiddenException("No tienes permisos para modificar este WOD");
    }
    return wod;
  }

  private Wod findById(Long id) {
    return wodRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("WOD no encontrado"));
  }

  private boolean isOwnedPersonal(Wod wod, User currentUser) {
    return wod.getOrigin() == WodOrigin.PERSONAL
        && wod.getOwner() != null
        && wod.getOwner().getId().equals(currentUser.getId());
  }
}
