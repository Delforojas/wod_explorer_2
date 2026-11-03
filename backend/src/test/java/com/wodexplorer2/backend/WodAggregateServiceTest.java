package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wodexplorer2.backend.dto.WodCompositionItemRequest;
import com.wodexplorer2.backend.dto.WodDefinitionRequest;
import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.User;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.exception.InvalidWodDefinitionException;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import com.wodexplorer2.backend.repository.WodItemPrescriptionRepository;
import com.wodexplorer2.backend.repository.WodProgressionRuleRepository;
import com.wodexplorer2.backend.repository.WodTimeExtensionRepository;
import com.wodexplorer2.backend.service.CurrentUserService;
import com.wodexplorer2.backend.service.WodAggregateService;
import com.wodexplorer2.backend.service.WodService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WodAggregateServiceTest {

  @Mock
  private WodService wodService;

  @Mock
  private WodRepository wodRepository;

  @Mock
  private WodVersionRepository wodVersionRepository;

  @Mock
  private WodVersionItemRepository wodVersionItemRepository;

  @Mock
  private WodItemPrescriptionRepository wodItemPrescriptionRepository;

  @Mock
  private WodProgressionRuleRepository wodProgressionRuleRepository;

  @Mock
  private WodTimeExtensionRepository wodTimeExtensionRepository;

  @Mock
  private ExerciseRepository exerciseRepository;

  @Mock
  private CurrentUserService currentUserService;

  private WodAggregateService aggregateService;

  @BeforeEach
  void setUp() {
    aggregateService = new WodAggregateService(
        wodService,
        wodRepository,
        wodVersionRepository,
        wodVersionItemRepository,
        wodItemPrescriptionRepository,
        wodProgressionRuleRepository,
        wodTimeExtensionRepository,
        exerciseRepository,
        currentUserService);
  }

  @Test
  void createsOrderedCompositionAndAllowsRepeatedExercise() {
    User owner = user(7L);
    Exercise exercise = mock(Exercise.class);
    when(currentUserService.require()).thenReturn(owner);
    when(exerciseRepository.findByIdAndActiveTrue(11L)).thenReturn(Optional.of(exercise));
    when(wodRepository.save(any(Wod.class))).thenAnswer(invocation -> invocation.getArgument(0));
    when(wodVersionRepository.findTopByWodIdOrderByVersionNumberDesc(null))
        .thenReturn(Optional.empty());
    when(wodVersionRepository.save(any(WodVersion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));
    when(wodVersionItemRepository.findByWodVersionIdOrderByPositionAsc(null))
        .thenReturn(List.of());

    WodDefinitionRequest request = definition(
        item(11L, 10, null, null, null),
        item(11L, 5, null, null, null));

    aggregateService.create(request);

    ArgumentCaptor<List<WodVersionItem>> captor = ArgumentCaptor.forClass(List.class);
    verify(wodVersionItemRepository).saveAll(captor.capture());
    List<WodVersionItem> items = captor.getValue();
    assertEquals(2, items.size());
    assertEquals(1, items.get(0).getPosition());
    assertEquals(2, items.get(1).getPosition());
    assertEquals(exercise, items.get(0).getExercise());
    assertEquals(exercise, items.get(1).getExercise());
  }

  @Test
  void rejectsEmptyCompositionBeforePersistence() {
    WodDefinitionRequest request = new WodDefinitionRequest(
        "Vacío",
        WodType.FOR_TIME,
        null,
        null,
        List.of(), null, null);

    assertThrows(InvalidWodDefinitionException.class, () -> aggregateService.create(request));
  }

  @Test
  void rejectsMissingOrInactiveExerciseBeforeCreatingWod() {
    when(exerciseRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());
    WodDefinitionRequest request = definition(
        item(99L, null, BigDecimal.ONE, null, null));

    assertThrows(RuntimeException.class, () -> aggregateService.create(request));
  }

  @Test
  void updateCreatesNextVersionInsteadOfEditingPreviousVersion() {
    User owner = user(7L);
    Wod wod = new Wod(owner, "Anterior", WodOrigin.PERSONAL);
    WodVersion previous = new WodVersion(wod, 3, WodType.FOR_TIME, null, null);
    Exercise exercise = mock(Exercise.class);
    when(wodService.requireOwnedPersonal(4L)).thenReturn(wod);
    when(exerciseRepository.findByIdAndActiveTrue(11L)).thenReturn(Optional.of(exercise));
    when(wodRepository.save(any(Wod.class))).thenAnswer(invocation -> invocation.getArgument(0));
    when(wodVersionRepository.findTopByWodIdOrderByVersionNumberDesc(null))
        .thenReturn(Optional.of(previous));
    when(wodVersionRepository.save(any(WodVersion.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));
    when(wodVersionItemRepository.findByWodVersionIdOrderByPositionAsc(null))
        .thenReturn(List.of());

    aggregateService.update(4L, definition(
        item(11L, 12, null, null, null)));

    ArgumentCaptor<WodVersion> captor = ArgumentCaptor.forClass(WodVersion.class);
    verify(wodVersionRepository).save(captor.capture());
    assertEquals(4, captor.getValue().getVersionNumber());
    assertEquals("Nuevo", wod.getName());
  }

  @Test
  void archiveDelegatesToExistingOwnershipPolicy() {
    aggregateService.archive(4L);

    verify(wodService).archive(4L);
  }

  private WodDefinitionRequest definition(WodCompositionItemRequest... items) {
    return new WodDefinitionRequest(
        "Nuevo",
        WodType.FOR_TIME,
        null,
        null,
        List.of(items), null, null);
  }

  private WodCompositionItemRequest item(
      Long exerciseId,
      Integer reps,
      BigDecimal weightKg,
      BigDecimal distanceM,
      Integer durationSeconds) {
    return new WodCompositionItemRequest(
        exerciseId, reps, weightKg, distanceM, durationSeconds, null, null);
  }

  private User user(Long id) {
    User user = mock(User.class);
    when(user.getId()).thenReturn(id);
    return user;
  }
}
