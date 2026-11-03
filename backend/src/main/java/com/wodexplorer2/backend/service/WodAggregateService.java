package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.dto.WodAggregateResponse;
import com.wodexplorer2.backend.dto.WodCompositionItemRequest;
import com.wodexplorer2.backend.dto.WodDefinitionRequest;
import com.wodexplorer2.backend.dto.WodItemPrescriptionResponse;
import com.wodexplorer2.backend.dto.WodProgressionRuleResponse;
import com.wodexplorer2.backend.dto.WodTimeExtensionResponse;
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
import com.wodexplorer2.backend.repository.WodItemPrescriptionRepository;
import com.wodexplorer2.backend.repository.WodProgressionRuleRepository;
import com.wodexplorer2.backend.repository.WodTimeExtensionRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class WodAggregateService {

  private final WodService wodService;
  private final WodRepository wodRepository;
  private final WodVersionRepository wodVersionRepository;
  private final WodVersionItemRepository wodVersionItemRepository;
  private final WodItemPrescriptionRepository wodItemPrescriptionRepository;
  private final WodProgressionRuleRepository wodProgressionRuleRepository;
  private final WodTimeExtensionRepository wodTimeExtensionRepository;
  private final ExerciseRepository exerciseRepository;
  private final CurrentUserService currentUserService;

  public WodAggregateService(
      WodService wodService,
      WodRepository wodRepository,
      WodVersionRepository wodVersionRepository,
      WodVersionItemRepository wodVersionItemRepository,
      WodItemPrescriptionRepository wodItemPrescriptionRepository,
      WodProgressionRuleRepository wodProgressionRuleRepository,
      WodTimeExtensionRepository wodTimeExtensionRepository,
      ExerciseRepository exerciseRepository,
      CurrentUserService currentUserService) {
    this.wodService = wodService;
    this.wodRepository = wodRepository;
    this.wodVersionRepository = wodVersionRepository;
    this.wodVersionItemRepository = wodVersionItemRepository;
    this.wodItemPrescriptionRepository = wodItemPrescriptionRepository;
    this.wodProgressionRuleRepository = wodProgressionRuleRepository;
    this.wodTimeExtensionRepository = wodTimeExtensionRepository;
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
    List<WodVersionItem> items = createItems(version, request.items(), exercises);
    createPrescriptionData(version, items, request);
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
    List<WodVersionItem> items = createItems(version, request.items(), exercises);
    createPrescriptionData(version, items, request);
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

  private List<WodVersionItem> createItems(
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
          request.durationSeconds(),
          request.calories()));
    }
    return wodVersionItemRepository.saveAll(items);
  }

  private void createPrescriptionData(
      WodVersion version,
      List<WodVersionItem> items,
      WodDefinitionRequest request) {
    List<com.wodexplorer2.backend.entity.WodItemPrescription> prescriptions = new ArrayList<>();
    for (int index = 0; index < items.size(); index++) {
      WodCompositionItemRequest itemRequest = request.items().get(index);
      if (itemRequest.prescriptions() != null) {
        for (var prescription : itemRequest.prescriptions()) {
          prescriptions.add(new com.wodexplorer2.backend.entity.WodItemPrescription(
              items.get(index), prescription.variant(), prescription.weightKg()));
        }
      }
    }
    if (!prescriptions.isEmpty()) {
      wodItemPrescriptionRepository.saveAll(prescriptions);
    }
    if (request.progressionRule() != null) {
      wodProgressionRuleRepository.save(new com.wodexplorer2.backend.entity.WodProgressionRule(
          version,
          request.progressionRule().startReps(),
          request.progressionRule().incrementReps(),
          request.progressionRule().everyRounds()));
    }
    if (request.timeExtension() != null) {
      wodTimeExtensionRepository.save(new com.wodexplorer2.backend.entity.WodTimeExtension(
          version,
          request.timeExtension().initialSeconds(),
          request.timeExtension().extensionSeconds(),
          request.timeExtension().roundsPerExtension()));
    }
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
        || item.durationSeconds() != null
        || item.calories() != null;
  }

  private boolean hasNegativePrescription(WodCompositionItemRequest item) {
    return item.reps() != null && item.reps() < 0
        || item.weightKg() != null && item.weightKg().signum() < 0
        || item.distanceM() != null && item.distanceM().signum() < 0
        || item.durationSeconds() != null && item.durationSeconds() < 0
        || item.calories() != null && item.calories() < 0;
  }

  private WodAggregateResponse toResponse(Wod wod) {
    WodVersion version = wodVersionRepository
        .findTopByWodIdOrderByVersionNumberDesc(wod.getId())
        .orElseThrow(() -> new ResourceNotFoundException("El WOD no tiene una versión válida"));
    return toResponse(wod, version);
  }

  private WodAggregateResponse toResponse(Wod wod, WodVersion version) {
    List<WodVersionItem> versionItems = wodVersionItemRepository
        .findByWodVersionIdOrderByPositionAsc(version.getId());
    Map<Long, List<WodItemPrescriptionResponse>> prescriptionsByItem = new HashMap<>();
    if (!versionItems.isEmpty() && version.getId() != null) {
      wodItemPrescriptionRepository.findByWodVersionItem_IdInOrderByWodVersionItem_IdAscVariantAsc(
              versionItems.stream().map(WodVersionItem::getId).toList())
          .forEach(prescription -> prescriptionsByItem
              .computeIfAbsent(prescription.getWodVersionItemId(), ignored -> new ArrayList<>())
              .add(new WodItemPrescriptionResponse(prescription.getVariant(), prescription.getWeightKg())));
    }
    WodProgressionRuleResponse progressionRule = null;
    WodTimeExtensionResponse timeExtension = null;
    if (version.getId() != null) {
      progressionRule = wodProgressionRuleRepository.findByWodVersion_IdIn(List.of(version.getId()))
          .stream()
          .findFirst()
          .map(rule -> new WodProgressionRuleResponse(
              rule.getStartReps(), rule.getIncrementReps(), rule.getEveryRounds()))
          .orElse(null);
      timeExtension = wodTimeExtensionRepository.findByWodVersion_IdIn(List.of(version.getId()))
          .stream()
          .findFirst()
          .map(extension -> new WodTimeExtensionResponse(
              extension.getInitialSeconds(), extension.getExtensionSeconds(), extension.getRoundsPerExtension()))
          .orElse(null);
    }
    List<WodVersionItemResponse> items = versionItems
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
            item.getDurationSeconds(),
            item.getCalories(),
            prescriptionsByItem.getOrDefault(item.getId(), List.of())))
        .toList();
    return new WodAggregateResponse(
        wod.getId(),
        wod.getOwner() != null ? wod.getOwner().getId() : null,
        wod.getName(),
        wod.getOrigin(),
        wod.getCategory(),
        wod.getCreatedAt(),
        new WodVersionResponse(
            version.getId(),
            wod.getId(),
            wod.getName(),
            version.getVersionNumber(),
            version.getType(),
            version.getTimeCapSeconds(),
            version.getRounds(),
            progressionRule,
            timeExtension,
            version.getCreatedAt()),
        items);
  }
}
