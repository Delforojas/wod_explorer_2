package com.wodexplorer2.backend;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;

import org.springframework.core.env.Environment;
import org.testcontainers.containers.MySQLContainer;

final class TestDatabaseSafetyGuard {

  private static final String DEVELOPMENT_DATABASE = "wod_explorer_2";

  TestDatabaseSafetyGuard(
      DataSource dataSource,
      MySQLContainer<?> mysqlContainer,
      Environment environment) {
    rejectDevelopmentConfiguration(environment.getProperty("spring.datasource.url"));
    try (Connection connection = dataSource.getConnection()) {
      validate(
          connection.getMetaData().getURL(),
          connection.getCatalog(),
          mysqlContainer.getJdbcUrl(),
          mysqlContainer.getDatabaseName());
    } catch (SQLException exception) {
      throw new IllegalStateException(
          "No se pudo validar el datasource de tests antes de ejecutar la suite", exception);
    }
  }

  static void validate(
      String actualUrl,
      String actualCatalog,
      String expectedUrl,
      String expectedCatalog) {
    if (DEVELOPMENT_DATABASE.equals(actualCatalog)) {
      throw new IllegalStateException(
          "Datasource de tests rechazado: apunta a la base de desarrollo "
              + DEVELOPMENT_DATABASE + ". No se ejecutarán escrituras.");
    }

    if (!expectedCatalog.equals(actualCatalog)) {
      throw new IllegalStateException(
          "Datasource de tests rechazado: catálogo inesperado '" + actualCatalog
              + "'; se esperaba '" + expectedCatalog + "'. No se ejecutarán escrituras.");
    }

    if (!withoutQuery(actualUrl).equals(withoutQuery(expectedUrl))) {
      throw new IllegalStateException(
          "Datasource de tests rechazado: endpoint inesperado '" + actualUrl
              + "'; se esperaba el endpoint efímero de Testcontainers '" + expectedUrl
              + "'. No se ejecutarán escrituras.");
    }
  }

  static void rejectDevelopmentConfiguration(String configuredUrl) {
    if (configuredUrl == null || configuredUrl.isBlank()) {
      return;
    }

    String normalizedUrl = withoutQuery(configuredUrl);
    if (normalizedUrl.endsWith("/" + DEVELOPMENT_DATABASE)
        || normalizedUrl.contains("/" + DEVELOPMENT_DATABASE + "/")) {
      throw new IllegalStateException(
          "Configuración de tests rechazada: spring.datasource.url apunta a la base de desarrollo "
              + DEVELOPMENT_DATABASE + ". No se ejecutarán escrituras.");
    }
  }

  private static String withoutQuery(String url) {
    int queryStart = url.indexOf('?');
    return queryStart >= 0 ? url.substring(0, queryStart) : url;
  }
}
