package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodAggregateResponse;
import com.wodexplorer2.backend.dto.WodCompositionItemRequest;
import com.wodexplorer2.backend.dto.WodDefinitionRequest;
import com.wodexplorer2.backend.dto.WodVersionItemResponse;
import com.wodexplorer2.backend.dto.WodVersionResponse;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.exception.InvalidWodDefinitionException;
import com.wodexplorer2.backend.exception.ResourceNotFoundException;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WodAggregateService {

  private final WodService wodService;
  private final WodRepository wodRepository;
  private final WodVersionRepository wodVersionRepository;
  private final WodVersionItemRepository wodVersionItemRepository;
  private final ExerciseRepository exerciseRepository;
  private final CurrentUserService currentUserService;

  public WodAggregateService(
      WodService wodService,
      WodRepository wodRepository,
      WodVersionRepository wodVersionRepository,
      WodVersionItemRepository wodVersionItemRepository,
      ExerciseRepository exerciseRepository,
      CurrentUserService currentUserService) {
    this.wodService = wodService;
    this.wodRepository = wodRepository;
    this.wodVersionRepository = wodVersionRepository;
    this.wodVersionItemRepository = wodVersionItemRepository;
    this.exerciseRepository = exerciseRepository;
    this.currentUserService = currentUserService;
  }

  @Transactional
  public WodAggregateResponse create(WodDefinitionRequest request) {
    validateDefinition(request);
    List<Exercise> exercises = resolveExercises(request.items());
    Wod wod = wodRepository.save(new Wod(
        currentUserService.require(),
        request.name(),
        WodOrigin.PERSONAL));
    WodVersion version = createVersion(wod, request);
    createItems(version, request.items(), exercises);
    return toResponse(wod, version);
  }

  @Transactional
  public WodAggregateResponse update(Long id, WodDefinitionRequest request) {
    validateDefinition(request);
    List<Exercise> exercises = resolveExercises(request.items());
    Wod wod = wodService.requireOwnedPersonal(id);
    wod.update(request.name());
    wodRepository.save(wod);
    WodVersion version = createVersion(wod, request);
    createItems(version, request.items(), exercises);
    return toResponse(wod, version);
  }

  @Transactional
  public List<WodAggregateResponse> findAll() {
    return wodService.findVisible().stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public WodAggregateResponse findById(Long id) {
    return toResponse(wodService.findVisibleById(id));
  }

  public void archive(Long id) {
    wodService.archive(id);
  }

  private WodVersion createVersion(Wod wod, WodDefinitionRequest request) {
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

  private void createItems(
      WodVersion version,
      List<WodCompositionItemRequest> requests,
      List<Exercise> exercises) {
    List<WodVersionItem> items = new ArrayList<>();
    for (int index = 0; index < requests.size(); index++) {
      WodCompositionItemRequest request = requests.get(index);
      items.add(new WodVersionItem(
          version,
          exercises.get(index),
          index + 1,
          request.reps(),
          request.weightKg(),
          request.distanceM(),
          request.durationSeconds()));
    }
    wodVersionItemRepository.saveAll(items);
  }

  private List<Exercise> resolveExercises(List<WodCompositionItemRequest> requests) {
    return requests.stream()
        .map(request -> exerciseRepository.findByIdAndActiveTrue(request.exerciseId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Ejercicio no encontrado o inactivo: " + request.exerciseId())))
        .toList();
  }

  private void validateDefinition(WodDefinitionRequest request) {
    if (request.type() == null) {
      throw new InvalidWodDefinitionException("La modalidad del WOD es obligatoria");
    }
    if (request.items() == null || request.items().isEmpty()) {
      throw new InvalidWodDefinitionException("La composición debe contener al menos un ejercicio");
    }
    if (request.type() != WodType.FOR_TIME && request.timeCapSeconds() == null) {
      throw new InvalidWodDefinitionException(
          "AMRAP y EMOM requieren un límite de tiempo positivo");
    }
    if (request.type() != WodType.FOR_TIME && request.rounds() != null) {
      throw new InvalidWodDefinitionException(
          "AMRAP y EMOM no admiten un número de rondas en la definición");
    }
    for (WodCompositionItemRequest item : request.items()) {
      if (item == null || !hasPrescription(item)) {
        throw new InvalidWodDefinitionException(
            "Cada ejercicio debe incluir al menos una prescripción");
      }
      if (hasNegativePrescription(item)) {
        throw new InvalidWodDefinitionException(
            "Las prescripciones no pueden tener valores negativos");
      }
    }
  }

  private boolean hasPrescription(WodCompositionItemRequest item) {
    return item.reps() != null
        || item.weightKg() != null
        || item.distanceM() != null
        || item.durationSeconds() != null;
  }

  private boolean hasNegativePrescription(WodCompositionItemRequest item) {
    return item.reps() != null && item.reps() < 0
        || item.weightKg() != null && item.weightKg().signum() < 0
        || item.distanceM() != null && item.distanceM().signum() < 0
        || item.durationSeconds() != null && item.durationSeconds() < 0;
  }

  private WodAggregateResponse toResponse(Wod wod) {
    WodVersion version = wodVersionRepository
        .findTopByWodIdOrderByVersionNumberDesc(wod.getId())
        .orElseThrow(() -> new ResourceNotFoundException("El WOD no tiene una versión válida"));
    return toResponse(wod, version);
  }

  private WodAggregateResponse toResponse(Wod wod, WodVersion version) {
    List<WodVersionItemResponse> items = wodVersionItemRepository.findByWodVersionIdOrderByPositionAsc(version.getId())
        .stream()
        .map(item -> new WodVersionItemResponse(
            item.getId(),
            version.getId(),
            item.getExercise().getId(),
            item.getExercise().getName(),
            item.getPosition(),
            item.getReps(),
            item.getWeightKg(),
            item.getDistanceM(),
            item.getDurationSeconds()))
        .toList();
    return new WodAggregateResponse(
        wod.getId(),
        wod.getOwner() != null ? wod.getOwner().getId() : null,
        wod.getName(),
        wod.getOrigin(),
        wod.getCreatedAt(),
        new WodVersionResponse(
            version.getId(),
            wod.getId(),
            wod.getName(),
            version.getVersionNumber(),
            version.getType(),
            version.getTimeCapSeconds(),
            version.getRounds(),
            version.getCreatedAt()),
        items);
  }
}
