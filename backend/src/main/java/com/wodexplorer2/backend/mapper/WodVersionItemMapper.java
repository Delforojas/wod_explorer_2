package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodVersionItemRequest;
import com.wodexplorer2.backend.dto.WodVersionItemResponse;
import com.wodexplorer2.backend.dto.WodItemPrescriptionResponse;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.repository.WodItemPrescriptionRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class WodVersionItemMapper {

  private final WodItemPrescriptionRepository wodItemPrescriptionRepository;

  public WodVersionItemMapper(WodItemPrescriptionRepository wodItemPrescriptionRepository) {
    this.wodItemPrescriptionRepository = wodItemPrescriptionRepository;
  }

  // REQUEST DTO → ENTITY
  public WodVersionItem toEntity(
      WodVersionItemRequest request,
      WodVersion wodVersion,
      Exercise exercise) {

    return new WodVersionItem(
        wodVersion,
        exercise,
        request.position(),
        request.reps(),
        request.weightKg(),
        request.distanceM(),
        request.durationSeconds(),
        request.calories());
  }

  // ENTITY → RESPONSE DTO
  public WodVersionItemResponse toResponse(WodVersionItem item) {
    return toResponses(List.of(item)).getFirst();
  }

  public List<WodVersionItemResponse> toResponses(List<WodVersionItem> items) {
    if (items.isEmpty()) {
      return List.of();
    }

    Map<Long, List<WodItemPrescriptionResponse>> prescriptionsByItem = new HashMap<>();
    wodItemPrescriptionRepository.findByWodVersionItem_IdInOrderByWodVersionItem_IdAscVariantAsc(
            items.stream().map(WodVersionItem::getId).toList())
        .forEach(prescription -> prescriptionsByItem
            .computeIfAbsent(prescription.getWodVersionItemId(), ignored -> new ArrayList<>())
            .add(new WodItemPrescriptionResponse(prescription.getVariant(), prescription.getWeightKg())));

    return items.stream().map(item -> toResponse(item, prescriptionsByItem.getOrDefault(item.getId(), List.of())))
        .toList();
  }

  private WodVersionItemResponse toResponse(
      WodVersionItem item,
      List<WodItemPrescriptionResponse> prescriptions) {
    return new WodVersionItemResponse(
        item.getId(),
        item.getWodVersion().getId(),
        item.getExercise().getId(),
        item.getExercise().getName(),
        item.getPosition(),
        item.getReps(),
        item.getWeightKg(),
        item.getDistanceM(),
        item.getDurationSeconds(),
        item.getCalories(),
        prescriptions);
  }
}
