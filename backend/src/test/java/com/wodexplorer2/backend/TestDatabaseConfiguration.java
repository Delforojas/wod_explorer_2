package com.wodexplorer2.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.stream.Stream;
import javax.sql.DataSource;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.utility.MountableFile;

@TestConfiguration(proxyBeanMethods = false)
class TestDatabaseConfiguration {

  static final String TEST_DATABASE = "wod_explorer_2_test";
  private static final String TEST_USERNAME = "wod_test";
  private static final String TEST_PASSWORD = "wod_test";

  @Bean
  @ServiceConnection
  MySQLContainer<?> mysqlContainer() {
    MySQLContainer<?> container = new MySQLContainer<>("mysql:8.4")
        .withDatabaseName(TEST_DATABASE)
        .withUsername(TEST_USERNAME)
        .withPassword(TEST_PASSWORD)
        .withReuse(false);

    Path initDirectory = locateInitDirectory();
    try (Stream<Path> scripts = Files.list(initDirectory)) {
      scripts.filter(path -> path.getFileName().toString().endsWith(".sql"))
          .sorted(Comparator.comparing(path -> path.getFileName().toString()))
          .forEach(path -> container.withCopyFileToContainer(
              MountableFile.forHostPath(path),
              "/docker-entrypoint-initdb.d/" + path.getFileName()));
    } catch (IOException exception) {
      throw new IllegalStateException(
          "No se pudieron localizar los scripts SQL de inicialización de tests en "
              + initDirectory,
          exception);
    }

    return container;
  }

  @Bean
  TestDatabaseSafetyGuard testDatabaseSafetyGuard(
      DataSource dataSource,
      MySQLContainer<?> mysqlContainer,
      Environment environment) {
    return new TestDatabaseSafetyGuard(dataSource, mysqlContainer, environment);
  }

  private static Path locateInitDirectory() {
    Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
    while (current != null) {
      Path candidate = current.resolve("Docker/mysql/init");
      if (Files.isDirectory(candidate)) {
        return candidate;
      }
      current = current.getParent();
    }
    throw new IllegalStateException(
        "No se encontró Docker/mysql/init desde el directorio de ejecución de Maven");
  }
}
