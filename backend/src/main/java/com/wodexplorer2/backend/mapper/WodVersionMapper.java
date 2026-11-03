package com.wodexplorer2.backend.mapper;

import com.wodexplorer2.backend.dto.WodVersionRequest;
import com.wodexplorer2.backend.dto.WodVersionResponse;
import com.wodexplorer2.backend.dto.WodProgressionRuleResponse;
import com.wodexplorer2.backend.dto.WodTimeExtensionResponse;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.repository.WodProgressionRuleRepository;
import com.wodexplorer2.backend.repository.WodTimeExtensionRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class WodVersionMapper {

  private final WodProgressionRuleRepository wodProgressionRuleRepository;
  private final WodTimeExtensionRepository wodTimeExtensionRepository;

  public WodVersionMapper(
      WodProgressionRuleRepository wodProgressionRuleRepository,
      WodTimeExtensionRepository wodTimeExtensionRepository) {
    this.wodProgressionRuleRepository = wodProgressionRuleRepository;
    this.wodTimeExtensionRepository = wodTimeExtensionRepository;
  }

  // REQUEST DTO → ENTITY
  public WodVersion toEntity(
      WodVersionRequest request,
      Wod wod,
      Integer versionNumber) {

    return new WodVersion(
        wod,
        versionNumber,
        request.type(),
        request.timeCapSeconds(),
        request.rounds());
  }

  // ENTITY → RESPONSE DTO
  public WodVersionResponse toResponse(WodVersion wodVersion) {
    return toResponses(List.of(wodVersion)).getFirst();
  }

  public List<WodVersionResponse> toResponses(List<WodVersion> versions) {
    if (versions.isEmpty()) {
      return List.of();
    }

    List<Long> versionIds = versions.stream().map(WodVersion::getId).toList();
    Map<Long, WodProgressionRuleResponse> progressionByVersion = new HashMap<>();
    wodProgressionRuleRepository.findByWodVersion_IdIn(versionIds).forEach(rule ->
        progressionByVersion.put(rule.getWodVersionId(), new WodProgressionRuleResponse(
            rule.getStartReps(), rule.getIncrementReps(), rule.getEveryRounds())));
    Map<Long, WodTimeExtensionResponse> extensionByVersion = new HashMap<>();
    wodTimeExtensionRepository.findByWodVersion_IdIn(versionIds).forEach(extension ->
        extensionByVersion.put(extension.getWodVersionId(), new WodTimeExtensionResponse(
            extension.getInitialSeconds(), extension.getExtensionSeconds(), extension.getRoundsPerExtension())));

    return versions.stream().map(version -> toResponse(
        version,
        progressionByVersion.get(version.getId()),
        extensionByVersion.get(version.getId()))).toList();
  }

  private WodVersionResponse toResponse(
      WodVersion wodVersion,
      WodProgressionRuleResponse progressionRule,
      WodTimeExtensionResponse timeExtension) {
    return new WodVersionResponse(
        wodVersion.getId(),
        wodVersion.getWod().getId(),
        wodVersion.getWod().getName(),
        wodVersion.getVersionNumber(),
        wodVersion.getType(),
        wodVersion.getTimeCapSeconds(),
        wodVersion.getRounds(),
        progressionRule,
        timeExtension,
        wodVersion.getCreatedAt());
  }
}
