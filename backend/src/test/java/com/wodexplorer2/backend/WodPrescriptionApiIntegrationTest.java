package com.wodexplorer2.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.wodexplorer2.backend.entity.Exercise;
import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.entity.WodItemPrescription;
import com.wodexplorer2.backend.entity.WodOrigin;
import com.wodexplorer2.backend.entity.WodPrescriptionVariant;
import com.wodexplorer2.backend.entity.WodProgressionRule;
import com.wodexplorer2.backend.entity.WodTimeExtension;
import com.wodexplorer2.backend.entity.WodType;
import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.repository.ExerciseRepository;
import com.wodexplorer2.backend.repository.WodItemPrescriptionRepository;
import com.wodexplorer2.backend.repository.WodProgressionRuleRepository;
import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.repository.WodTimeExtensionRepository;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import com.wodexplorer2.backend.repository.WodVersionRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@Import(TestDatabaseConfiguration.class)
class WodPrescriptionApiIntegrationTest extends AbstractMySqlIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ExerciseRepository exerciseRepository;

  @Autowired
  private WodRepository wodRepository;

  @Autowired
  private WodVersionRepository wodVersionRepository;

  @Autowired
  private WodVersionItemRepository wodVersionItemRepository;

  @Autowired
  private WodItemPrescriptionRepository wodItemPrescriptionRepository;

  @Autowired
  private WodProgressionRuleRepository wodProgressionRuleRepository;

  @Autowired
  private WodTimeExtensionRepository wodTimeExtensionRepository;

  private Wod advancedWod;
  private WodVersion advancedVersion;
  private WodVersionItem advancedItem;
  private WodVersion plainVersion;

  @BeforeEach
  void setUp() {
    Exercise exercise = exerciseRepository.findByActiveTrue().getFirst();
    advancedWod = wodRepository.save(new Wod(
        null, "Prescription contract " + UUID.randomUUID(), WodOrigin.GENERIC));
    advancedVersion = wodVersionRepository.save(new WodVersion(
        advancedWod, 1, WodType.AMRAP, 240, null));
    advancedItem = wodVersionItemRepository.save(new WodVersionItem(
        advancedVersion,
        exercise,
        1,
        15,
        new BigDecimal("43.000"),
        new BigDecimal("50.00"),
        60,
        20));
    wodVersionItemRepository.save(new WodVersionItem(
        advancedVersion, exercise, 2, null, null, new BigDecimal("1000.00"), null, null));
    wodItemPrescriptionRepository.save(new WodItemPrescription(
        advancedItem, WodPrescriptionVariant.MEN, new BigDecimal("45.359")));
    wodItemPrescriptionRepository.save(new WodItemPrescription(
        advancedItem, WodPrescriptionVariant.WOMEN, new BigDecimal("29.484")));
    wodProgressionRuleRepository.save(new WodProgressionRule(advancedVersion, 3, 3, 1));
    wodTimeExtensionRepository.save(new WodTimeExtension(advancedVersion, 240, 240, 3));

    Wod plainWod = wodRepository.save(new Wod(
        null, "No optional rules " + UUID.randomUUID(), WodOrigin.GENERIC));
    plainVersion = wodVersionRepository.save(new WodVersion(
        plainWod, 1, WodType.FOR_TIME, null, null));
  }

  @Test
  void exposesTheSamePrescriptionContractFromAggregateAndDirectEndpoints() throws Exception {
    mockMvc.perform(get("/api/wods/{id}", advancedWod.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.composition.length()").value(2))
        .andExpect(jsonPath("$.composition[0].calories").value(20))
        .andExpect(jsonPath("$.composition[0].distanceM").value(50))
        .andExpect(jsonPath("$.composition[0].durationSeconds").value(60))
        .andExpect(jsonPath("$.composition[0].prescriptions.length()").value(2))
        .andExpect(jsonPath("$.version.progressionRule.startReps").value(3))
        .andExpect(jsonPath("$.version.timeExtension.roundsPerExtension").value(3));

    mockMvc.perform(get("/api/wod-version-items/{id}", advancedItem.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.calories").value(20))
        .andExpect(jsonPath("$.distanceM").value(50))
        .andExpect(jsonPath("$.durationSeconds").value(60))
        .andExpect(jsonPath("$.prescriptions.length()").value(2))
        .andExpect(jsonPath("$.prescriptions[0].variant").value("MEN"))
        .andExpect(jsonPath("$.prescriptions[1].variant").value("WOMEN"));

    mockMvc.perform(get("/api/wod-versions/{id}", advancedVersion.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.progressionRule.startReps").value(3))
        .andExpect(jsonPath("$.progressionRule.incrementReps").value(3))
        .andExpect(jsonPath("$.timeExtension.initialSeconds").value(240))
        .andExpect(jsonPath("$.timeExtension.extensionSeconds").value(240));
  }

  @Test
  void omitsOptionalRulesWhenTheVersionHasNone() throws Exception {
    mockMvc.perform(get("/api/wod-versions/{id}", plainVersion.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.progressionRule").doesNotExist())
        .andExpect(jsonPath("$.timeExtension").doesNotExist());
  }
}
