package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.dto.WodResultRequest;
import com.wodexplorer2.backend.dto.WodResultUpdateRequest;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.exception.InvalidWodResultException;
import com.wodexplorer2.backend.mapper.WodResultMapper;
import com.wodexplorer2.backend.repository.WodResultRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.WodResultService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WodResultServiceTest {

  @Mock
  private WodResultRepository wodResultRepository;

  @Mock
  private WodVersionRepository wodVersionRepository;

  @Mock
  private WodVersionItemRepository wodVersionItemRepository;

  @Mock
  private WodResultMapper wodResultMapper;

  @Mock
  private CurrentUserService currentUserService;

  private WodResultService wodResultService;

  @BeforeEach
  void setUp() {
    wodResultService = new WodResultService(
        wodResultRepository,
        wodVersionRepository,
        wodVersionItemRepository,
        wodResultMapper,
        currentUserService);
  }

  @Test
  void rejectsForTimeWithoutACompatibleResult() {
    User user = mock(User.class);
    WodVersion version = versionForCreate(WodType.FOR_TIME);
    when(currentUserService.require()).thenReturn(user);
    when(wodVersionRepository.findById(1L)).thenReturn(Optional.of(version));

    WodResultRequest request = new WodResultRequest(
        1L,
        LocalDateTime.parse("2026-09-26T10:00:00"),
        true,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);

    assertThrows(InvalidWodResultException.class, () -> wodResultService.create(request));
    verify(wodResultRepository, never()).save(any());
  }

  @Test
  void rejectsAmrapWhenTimeFieldsArePresent() {
    User user = mock(User.class);
    WodVersion version = versionForCreate(WodType.AMRAP);
    when(currentUserService.require()).thenReturn(user);
    when(wodVersionRepository.findById(1L)).thenReturn(Optional.of(version));

    WodResultRequest request = new WodResultRequest(
        1L,
        LocalDateTime.parse("2026-09-26T10:00:00"),
        null,
        120,
        null,
        null,
        null,
        null,
        null,
        5,
        2);

    assertThrows(InvalidWodResultException.class, () -> wodResultService.create(request));
    verify(wodResultRepository, never()).save(any());
  }

  @Test
  void rejectsEmomWithMultipleProgressMetrics() {
    User user = mock(User.class);
    WodVersion version = versionForCreate(WodType.EMOM);
    when(currentUserService.require()).thenReturn(user);
    when(wodVersionRepository.findById(1L)).thenReturn(Optional.of(version));

    WodResultRequest request = new WodResultRequest(
        1L,
        LocalDateTime.parse("2026-09-26T10:00:00"),
        null,
        null,
        4,
        null,
        5,
        java.math.BigDecimal.ONE,
        null,
        null,
        null);

    assertThrows(InvalidWodResultException.class, () -> wodResultService.create(request));
    verify(wodResultRepository, never()).save(any());
  }

  @Test
  void acceptsMultipleAmrapAttemptsWithoutReplacingEarlierResults() {
    User user = mock(User.class);
    WodVersion version = versionForCreate(WodType.AMRAP);
    WodResult first = mock(WodResult.class);
    WodResult second = mock(WodResult.class);
    when(currentUserService.require()).thenReturn(user);
    when(wodVersionRepository.findById(2L)).thenReturn(Optional.of(version));
    when(wodResultMapper.toEntity(any(), eq(user), eq(version), eq(null)))
        .thenReturn(first, second);
    when(wodResultRepository.save(first)).thenReturn(first);
    when(wodResultRepository.save(second)).thenReturn(second);

    WodResultRequest request = new WodResultRequest(
        2L,
        LocalDateTime.parse("2026-09-26T10:00:00"),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        5,
        3);

    wodResultService.create(request);
    wodResultService.create(request);

    verify(wodResultRepository).save(first);
    verify(wodResultRepository).save(second);
  }

  @Test
  void updatesOnlyOwnResultAndKeepsItsVersion() {
    User user = user(7L);
    WodVersion version = versionForUpdate(WodType.FOR_TIME);
    WodResult result = mock(WodResult.class);
    when(currentUserService.require()).thenReturn(user);
    when(wodResultRepository.findById(10L)).thenReturn(Optional.of(result));
    when(result.getUser()).thenReturn(user);
    when(result.getWodVersion()).thenReturn(version);
    when(wodResultRepository.save(result)).thenReturn(result);

    WodResultUpdateRequest request = new WodResultUpdateRequest(
        LocalDateTime.parse("2026-09-26T10:30:00"),
        true,
        240,
        null,
        null,
        null,
        null,
        null,
        null,
        null);

    wodResultService.update(10L, request);

    verify(result).update(
        request.performedAt(),
        request.completed(),
        request.timeSeconds(),
        request.progressRounds(),
        null,
        request.progressReps(),
        request.progressDistanceM(),
        request.progressDurationSeconds(),
        request.amrapRounds(),
        request.amrapExtraReps());
    verify(result).getWodVersion();
  }

  @Test
  void delegatesHistoryFiltersWithCurrentUser() {
    User user = user(7L);
    LocalDateTime from = LocalDateTime.parse("2026-09-01T00:00:00");
    LocalDateTime to = LocalDateTime.parse("2026-09-30T23:59:59");
    when(currentUserService.require()).thenReturn(user);
    when(wodResultRepository.findHistory(
        7L, 22L, WodType.AMRAP, WodOrigin.GENERIC, from, to))
        .thenReturn(List.of());

    assertEquals(
        List.of(),
        wodResultService.findAll(22L, WodType.AMRAP, WodOrigin.GENERIC, from, to));

    verify(wodResultRepository).findHistory(7L, 22L, WodType.AMRAP, WodOrigin.GENERIC, from, to);
  }

  @Test
  void derivesBestMarksForForTimeAmrapAndEmom() {
    User user = user(7L);
    when(currentUserService.require()).thenReturn(user);

    WodVersion forTime = versionForBest(1L, WodType.FOR_TIME);
    WodResult slowForTime = forTimeResult(forTime, 100L, 300);
    WodResult fastForTime = forTimeResult(forTime, 101L, 240);

    WodVersion amrap = versionForBest(2L, WodType.AMRAP);
    WodResult lowerAmrap = amrapResult(amrap, 200L, 5, 2);
    WodResult higherAmrap = amrapResult(amrap, 201L, 5, 6);

    WodVersion emom = versionForBest(3L, WodType.EMOM);
    WodResult lowerEmom = emomResult(emom, 300L, 4, 5);
    WodResult higherEmom = emomResult(emom, 301L, 6, 1);

    when(wodResultRepository.findHistory(7L, null, null, null, null, null))
        .thenReturn(List.of(slowForTime, fastForTime, lowerAmrap, higherAmrap, lowerEmom, higherEmom));

    List<WodResult> bests = wodResultService.findPersonalBests();

    assertEquals(3, bests.size());
    org.junit.jupiter.api.Assertions.assertTrue(bests.contains(fastForTime));
    org.junit.jupiter.api.Assertions.assertTrue(bests.contains(higherAmrap));
    org.junit.jupiter.api.Assertions.assertTrue(bests.contains(higherEmom));
  }

  private WodVersion versionForCreate(WodType type) {
    WodVersion version = mock(WodVersion.class);
    Wod wod = mock(Wod.class);
    when(version.getType()).thenReturn(type);
    when(version.getWod()).thenReturn(wod);
    when(wod.getDeletedAt()).thenReturn(null);
    when(wod.getOrigin()).thenReturn(WodOrigin.GENERIC);
    return version;
  }

  private WodVersion versionForUpdate(WodType type) {
    WodVersion version = mock(WodVersion.class);
    when(version.getType()).thenReturn(type);
    return version;
  }

  private WodVersion versionForBest(Long id, WodType type) {
    WodVersion version = mock(WodVersion.class);
    when(version.getId()).thenReturn(id);
    when(version.getType()).thenReturn(type);
    return version;
  }

  private WodResult forTimeResult(WodVersion version, Long id, int timeSeconds) {
    WodResult result = mock(WodResult.class);
    when(result.getWodVersion()).thenReturn(version);
    when(result.getCompleted()).thenReturn(true);
    when(result.getTimeSeconds()).thenReturn(timeSeconds);
    when(result.getProgressRounds()).thenReturn(null);
    when(result.getProgressItem()).thenReturn(null);
    when(result.getProgressReps()).thenReturn(null);
    when(result.getProgressDistanceM()).thenReturn(null);
    when(result.getProgressDurationSeconds()).thenReturn(null);
    when(result.getAmrapRounds()).thenReturn(null);
    when(result.getAmrapExtraReps()).thenReturn(null);
    return result;
  }

  private WodResult amrapResult(WodVersion version, Long id, int rounds, int extraReps) {
    WodResult result = mock(WodResult.class);
    when(result.getWodVersion()).thenReturn(version);
    when(result.getAmrapRounds()).thenReturn(rounds);
    when(result.getAmrapExtraReps()).thenReturn(extraReps);
    when(result.getTimeSeconds()).thenReturn(null);
    when(result.getProgressRounds()).thenReturn(null);
    when(result.getProgressItem()).thenReturn(null);
    when(result.getProgressReps()).thenReturn(null);
    when(result.getProgressDistanceM()).thenReturn(null);
    when(result.getProgressDurationSeconds()).thenReturn(null);
    return result;
  }

  private WodResult emomResult(WodVersion version, Long id, int rounds, int reps) {
    WodResult result = mock(WodResult.class);
    when(result.getWodVersion()).thenReturn(version);
    when(result.getProgressRounds()).thenReturn(rounds);
    when(result.getProgressReps()).thenReturn(reps);
    when(result.getTimeSeconds()).thenReturn(null);
    when(result.getProgressItem()).thenReturn(null);
    when(result.getProgressDistanceM()).thenReturn(null);
    when(result.getProgressDurationSeconds()).thenReturn(null);
    when(result.getAmrapRounds()).thenReturn(null);
    when(result.getAmrapExtraReps()).thenReturn(null);
    return result;
  }

  private User user(Long id) {
    User user = mock(User.class);
    when(user.getId()).thenReturn(id);
    return user;
  }
}
