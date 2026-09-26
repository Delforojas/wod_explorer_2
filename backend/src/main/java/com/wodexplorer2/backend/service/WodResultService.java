package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodResultRequest;
import com.wodexplorer2.backend.dto.WodResultUpdateRequest;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.exception.ForbiddenException;
import com.wodexplorer2.backend.exception.InvalidWodResultException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.mapper.WodResultMapper;
import com.wodexplorer2.backend.repository.WodResultRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

  @Transactional(readOnly = true)
  public List<WodResult> findAll(
      Long wodId,
      WodType type,
      WodOrigin origin,
      LocalDateTime from,
      LocalDateTime to) {
    User user = currentUserService.require();
    return wodResultRepository.findHistory(user.getId(), wodId, type, origin, from, to);
  }

  @Transactional(readOnly = true)
  public List<WodResult> findPersonalBests() {
    User user = currentUserService.require();
    List<WodResult> results = wodResultRepository.findHistory(
        user.getId(), null, null, null, null, null);
    Map<BestKey, WodResult> bestByKey = new HashMap<>();
    for (WodResult result : results) {
      if (!isValidForBest(result)) {
        continue;
      }
      BestKey key = bestKey(result);
      WodResult currentBest = bestByKey.get(key);
      if (currentBest == null || compareForBest(result, currentBest) > 0) {
        bestByKey.put(key, result);
      }
    }
    return new ArrayList<>(bestByKey.values());
  }

  @Transactional(readOnly = true)
  public WodResult findById(Long id) {
    return requireOwned(id);
  }

  @Transactional
  public WodResult create(WodResultRequest request) {
    User user = currentUserService.require();
    WodVersion version = wodVersionRepository.findById(request.wodVersionId())
        .orElseThrow(() -> new ResourceNotFoundException("Versión de WOD no encontrada"));
    if (!canUseVersion(version, user)) {
      throw new ForbiddenException("No tienes permisos para registrar un resultado en este WOD");
    }

    WodVersionItem progressItem = resolveProgressItem(request.progressItemId(), version);
    validateResult(
        version.getType(),
        request.completed(),
        request.timeSeconds(),
        request.progressRounds(),
        progressItem,
        request.progressReps(),
        request.progressDistanceM(),
        request.progressDurationSeconds(),
        request.amrapRounds(),
        request.amrapExtraReps());

    return wodResultRepository.save(wodResultMapper.toEntity(
        request,
        user,
        version,
        progressItem));
  }

  @Transactional
  public WodResult update(Long id, WodResultUpdateRequest request) {
    WodResult result = requireOwned(id);
    WodVersion version = result.getWodVersion();
    WodVersionItem progressItem = resolveProgressItem(request.progressItemId(), version);
    validateResult(
        version.getType(),
        request.completed(),
        request.timeSeconds(),
        request.progressRounds(),
        progressItem,
        request.progressReps(),
        request.progressDistanceM(),
        request.progressDurationSeconds(),
        request.amrapRounds(),
        request.amrapExtraReps());

    result.update(
        request.performedAt(),
        request.completed(),
        request.timeSeconds(),
        request.progressRounds(),
        progressItem,
        request.progressReps(),
        request.progressDistanceM(),
        request.progressDurationSeconds(),
        request.amrapRounds(),
        request.amrapExtraReps());
    return wodResultRepository.save(result);
  }

  @Transactional
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

  private WodVersionItem resolveProgressItem(Long progressItemId, WodVersion version) {
    if (progressItemId == null) {
      return null;
    }
    WodVersionItem progressItem = wodVersionItemRepository.findById(progressItemId)
        .orElseThrow(() -> new ResourceNotFoundException("Elemento de progreso no encontrado"));
    if (!progressItem.getWodVersion().getId().equals(version.getId())) {
      throw new ResourceNotFoundException("Elemento de progreso no encontrado");
    }
    return progressItem;
  }

  private void validateResult(
      WodType type,
      Boolean completed,
      Integer timeSeconds,
      Integer progressRounds,
      WodVersionItem progressItem,
      Integer progressReps,
      BigDecimal progressDistanceM,
      Integer progressDurationSeconds,
      Integer amrapRounds,
      Integer amrapExtraReps) {
    validateNonNegative(timeSeconds, "timeSeconds");
    validateNonNegative(progressRounds, "progressRounds");
    validateNonNegative(progressReps, "progressReps");
    validateNonNegative(progressDistanceM, "progressDistanceM");
    validateNonNegative(progressDurationSeconds, "progressDurationSeconds");
    validateNonNegative(amrapRounds, "amrapRounds");
    validateNonNegative(amrapExtraReps, "amrapExtraReps");

    switch (type) {
      case FOR_TIME -> validateForTime(
          completed,
          timeSeconds,
          progressRounds,
          progressItem,
          progressReps,
          progressDistanceM,
          progressDurationSeconds,
          amrapRounds,
          amrapExtraReps);
      case AMRAP -> validateAmrap(
          timeSeconds,
          progressRounds,
          progressItem,
          progressReps,
          progressDistanceM,
          progressDurationSeconds,
          amrapRounds,
          amrapExtraReps);
      case EMOM -> validateEmom(
          timeSeconds,
          progressRounds,
          progressItem,
          progressReps,
          progressDistanceM,
          progressDurationSeconds,
          amrapRounds,
          amrapExtraReps);
    }
  }

  private void validateForTime(
      Boolean completed,
      Integer timeSeconds,
      Integer progressRounds,
      WodVersionItem progressItem,
      Integer progressReps,
      BigDecimal progressDistanceM,
      Integer progressDurationSeconds,
      Integer amrapRounds,
      Integer amrapExtraReps) {
    if (completed == null) {
      throw invalid("completed es obligatorio para FOR_TIME");
    }
    if (amrapRounds != null || amrapExtraReps != null) {
      throw invalid("FOR_TIME no admite campos AMRAP");
    }
    if (Boolean.TRUE.equals(completed)) {
      if (timeSeconds == null || timeSeconds <= 0) {
        throw invalid("Un FOR_TIME completado requiere un tiempo positivo");
      }
      if (hasProgress(progressRounds, progressItem, progressReps, progressDistanceM,
          progressDurationSeconds)) {
        throw invalid("Un FOR_TIME completado no admite campos de progreso");
      }
      return;
    }
    if (timeSeconds != null) {
      throw invalid("Un FOR_TIME no completado no admite tiempo");
    }
    if (!hasProgress(progressRounds, progressItem, progressReps, progressDistanceM,
        progressDurationSeconds)) {
      throw invalid("Un FOR_TIME no completado requiere progreso");
    }
  }

  private void validateAmrap(
      Integer timeSeconds,
      Integer progressRounds,
      WodVersionItem progressItem,
      Integer progressReps,
      BigDecimal progressDistanceM,
      Integer progressDurationSeconds,
      Integer amrapRounds,
      Integer amrapExtraReps) {
    if (amrapRounds == null || amrapExtraReps == null) {
      throw invalid("AMRAP requiere rondas y repeticiones adicionales");
    }
    if (timeSeconds != null || hasProgress(progressRounds, progressItem, progressReps,
        progressDistanceM, progressDurationSeconds)) {
      throw invalid("AMRAP no admite tiempo ni campos de progreso");
    }
  }

  private void validateEmom(
      Integer timeSeconds,
      Integer progressRounds,
      WodVersionItem progressItem,
      Integer progressReps,
      BigDecimal progressDistanceM,
      Integer progressDurationSeconds,
      Integer amrapRounds,
      Integer amrapExtraReps) {
    if (progressRounds == null) {
      throw invalid("EMOM requiere rondas de progreso");
    }
    if (timeSeconds != null || amrapRounds != null || amrapExtraReps != null) {
      throw invalid("EMOM no admite tiempo ni campos AMRAP");
    }
    int metricCount = countNonNull(progressReps, progressDistanceM, progressDurationSeconds);
    if (metricCount > 1) {
      throw invalid("EMOM admite como máximo una métrica de progreso");
    }
  }

  private boolean hasProgress(
      Integer progressRounds,
      WodVersionItem progressItem,
      Integer progressReps,
      BigDecimal progressDistanceM,
      Integer progressDurationSeconds) {
    return progressRounds != null
        || progressItem != null
        || progressReps != null
        || progressDistanceM != null
        || progressDurationSeconds != null;
  }

  private int countNonNull(Object... values) {
    int count = 0;
    for (Object value : values) {
      if (value != null) {
        count++;
      }
    }
    return count;
  }

  private void validateNonNegative(Integer value, String field) {
    if (value != null && value < 0) {
      throw invalid(field + " no puede ser negativo");
    }
  }

  private void validateNonNegative(BigDecimal value, String field) {
    if (value != null && value.signum() < 0) {
      throw invalid(field + " no puede ser negativo");
    }
  }

  private InvalidWodResultException invalid(String message) {
    return new InvalidWodResultException(message);
  }

  private boolean canUseVersion(WodVersion version, User user) {
    return version.getWod().getDeletedAt() == null
        && (version.getWod().getOrigin() == WodOrigin.GENERIC
            || version.getWod().getOwner() != null
            && version.getWod().getOwner().getId().equals(user.getId()));
  }

  private boolean isValidForBest(WodResult result) {
    WodType type = result.getWodVersion().getType();
    if (type == WodType.FOR_TIME) {
      return Boolean.TRUE.equals(result.getCompleted())
          && result.getTimeSeconds() != null
          && result.getTimeSeconds() > 0
          && !hasProgress(
              result.getProgressRounds(),
              result.getProgressItem(),
              result.getProgressReps(),
              result.getProgressDistanceM(),
              result.getProgressDurationSeconds())
          && result.getAmrapRounds() == null
          && result.getAmrapExtraReps() == null;
    }
    if (type == WodType.AMRAP) {
      return result.getAmrapRounds() != null
          && result.getAmrapRounds() >= 0
          && result.getAmrapExtraReps() != null
          && result.getAmrapExtraReps() >= 0
          && result.getTimeSeconds() == null
          && !hasProgress(
              result.getProgressRounds(),
              result.getProgressItem(),
              result.getProgressReps(),
              result.getProgressDistanceM(),
              result.getProgressDurationSeconds());
    }
    return result.getProgressRounds() != null
        && result.getProgressRounds() >= 0
        && result.getTimeSeconds() == null
        && result.getAmrapRounds() == null
        && result.getAmrapExtraReps() == null
        && countNonNull(
            result.getProgressReps(),
            result.getProgressDistanceM(),
            result.getProgressDurationSeconds()) <= 1;
  }

  private BestKey bestKey(WodResult result) {
    if (result.getWodVersion().getType() != WodType.EMOM) {
      return new BestKey(result.getWodVersion().getId(), null, null);
    }
    return new BestKey(
        result.getWodVersion().getId(),
        result.getProgressItem() == null ? null : result.getProgressItem().getId(),
        progressMetric(result));
  }

  private String progressMetric(WodResult result) {
    if (result.getProgressReps() != null) {
      return "reps";
    }
    if (result.getProgressDistanceM() != null) {
      return "distance";
    }
    if (result.getProgressDurationSeconds() != null) {
      return "duration";
    }
    return "none";
  }

  private int compareForBest(WodResult candidate, WodResult currentBest) {
    WodType type = candidate.getWodVersion().getType();
    if (type == WodType.FOR_TIME) {
      return Integer.compare(currentBest.getTimeSeconds(), candidate.getTimeSeconds());
    }
    if (type == WodType.AMRAP) {
      int rounds = Integer.compare(candidate.getAmrapRounds(), currentBest.getAmrapRounds());
      return rounds != 0
          ? rounds
          : Integer.compare(candidate.getAmrapExtraReps(), currentBest.getAmrapExtraReps());
    }
    int rounds = Integer.compare(candidate.getProgressRounds(), currentBest.getProgressRounds());
    if (rounds != 0) {
      return rounds;
    }
    return compareEmomMetric(candidate, currentBest);
  }

  private int compareEmomMetric(WodResult candidate, WodResult currentBest) {
    if (candidate.getProgressReps() != null) {
      return Integer.compare(candidate.getProgressReps(), currentBest.getProgressReps());
    }
    if (candidate.getProgressDistanceM() != null) {
      return candidate.getProgressDistanceM().compareTo(currentBest.getProgressDistanceM());
    }
    if (candidate.getProgressDurationSeconds() != null) {
      return Integer.compare(
          candidate.getProgressDurationSeconds(), currentBest.getProgressDurationSeconds());
    }
    return 0;
  }

  private record BestKey(Long versionId, Long progressItemId, String metric) {
  }
}
