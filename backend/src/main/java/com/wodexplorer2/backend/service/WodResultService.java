package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodResultRequest;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.mapper.WodResultMapper;
import com.wodexplorer2.backend.repository.WodResultRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WodResultService {

  private final WodResultRepository wodResultRepository;
  private final WodVersionRepository wodVersionRepository;
  private final WodVersionItemRepository wodVersionItemRepository;
  private final WodResultMapper wodResultMapper;
  private final CurrentUserService currentUserService;

  public WodResultService(
      WodResultRepository wodResultRepository,
      WodVersionRepository wodVersionRepository,
      WodVersionItemRepository wodVersionItemRepository,
      WodResultMapper wodResultMapper,
      CurrentUserService currentUserService) {
    this.wodResultRepository = wodResultRepository;
    this.wodVersionRepository = wodVersionRepository;
    this.wodVersionItemRepository = wodVersionItemRepository;
    this.wodResultMapper = wodResultMapper;
    this.currentUserService = currentUserService;
  }

  public List<WodResult> findAll() {
    return wodResultRepository.findByUserIdOrderByPerformedAtDesc(currentUserService.require().getId());
  }

  public WodResult findById(Long id) {
    return requireOwned(id);
  }

  public WodResult create(WodResultRequest request) {
    User user = currentUserService.require();
    WodVersion version = wodVersionRepository.findById(request.wodVersionId())
        .orElseThrow(() -> new ResourceNotFoundException("Versión de WOD no encontrada"));
    if (!canUseVersion(version, user)) {
      throw new ForbiddenException("No tienes permisos para registrar un resultado en este WOD");
    }

    WodVersionItem progressItem = null;
    if (request.progressItemId() != null) {
      progressItem = wodVersionItemRepository.findById(request.progressItemId())
          .orElseThrow(() -> new ResourceNotFoundException("Elemento de progreso no encontrado"));
      if (!progressItem.getWodVersion().getId().equals(version.getId())) {
        throw new ResourceNotFoundException("Elemento de progreso no encontrado");
      }
    }

    return wodResultRepository.save(wodResultMapper.toEntity(
        request,
        user,
        version,
        progressItem));
  }

  public void deleteById(Long id) {
    wodResultRepository.delete(requireOwned(id));
  }

  private WodResult requireOwned(Long id) {
    User currentUser = currentUserService.require();
    WodResult result = wodResultRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Resultado no encontrado"));
    if (!result.getUser().getId().equals(currentUser.getId())) {
      throw new ForbiddenException("No tienes permisos para acceder a este resultado");
    }
    return result;
  }

  private boolean canUseVersion(WodVersion version, User user) {
    return version.getWod().getDeletedAt() == null
        && (version.getWod().getOrigin() == WodOrigin.GENERIC
            || version.getWod().getOwner() != null
            && version.getWod().getOwner().getId().equals(user.getId()));
  }
}
