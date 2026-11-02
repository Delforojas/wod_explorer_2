package com.wodexplorer2.backend;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TestDatabaseSafetyGuardTest {

  private static final String EXPECTED_URL =
      "jdbc:mysql://localhost:49152/wod_explorer_2_test";

  @Test
  void acceptsTheExpectedEphemeralDatasource() {
    assertThatCode(() -> TestDatabaseSafetyGuard.validate(
        EXPECTED_URL,
        TestDatabaseConfiguration.TEST_DATABASE,
        EXPECTED_URL,
        TestDatabaseConfiguration.TEST_DATABASE))
        .doesNotThrowAnyException();
  }

  @Test
  void rejectsTheDevelopmentDatasourceBeforeAnyWrite() {
    assertThatThrownBy(() -> TestDatabaseSafetyGuard.validate(
        "jdbc:mysql://localhost:3309/wod_explorer_2",
        "wod_explorer_2",
        EXPECTED_URL,
        TestDatabaseConfiguration.TEST_DATABASE))
        .isInstanceOf(IllegalStateException.class)
        .hasMessageContaining("base de desarrollo");
  }

  @Test
  void rejectsAnUnexpectedEndpointEvenWithTheTestCatalog() {
    assertThatThrownBy(() -> TestDatabaseSafetyGuard.validate(
        "jdbc:mysql://localhost:3309/wod_explorer_2_test",
        TestDatabaseConfiguration.TEST_DATABASE,
        EXPECTED_URL,
        TestDatabaseConfiguration.TEST_DATABASE))
        .isInstanceOf(IllegalStateException.class)
        .hasMessageContaining("endpoint inesperado");
  }

  @Test
  void rejectsAnExplicitDevelopmentConfigurationBeforeOpeningTheDatasource() {
    assertThatThrownBy(() -> TestDatabaseSafetyGuard.rejectDevelopmentConfiguration(
        "jdbc:mysql://localhost:3309/wod_explorer_2"))
        .isInstanceOf(IllegalStateException.class)
        .hasMessageContaining("spring.datasource.url");
  }
}
