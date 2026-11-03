package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

@Import(TestDatabaseConfiguration.class)
class WodPrescriptionMigrationIntegrationTest extends AbstractMySqlIntegrationTest {

  @Autowired
  private DataSource dataSource;

  @Test
  void reappliesSafelyWhenThePrescriptionSchemaAlreadyExists() throws Exception {
    Path migration = Path.of(System.getProperty("user.dir"))
        .resolve("../Docker/mysql/init/004_wod_prescription_contract.sql")
        .normalize();

    try (var connection = dataSource.getConnection()) {
      ScriptUtils.executeSqlScript(connection, new FileSystemResource(migration));
      try (var statement = connection.prepareStatement("""
          SELECT COUNT(*)
          FROM information_schema.columns
          WHERE table_schema = DATABASE()
            AND table_name = 'wod_version_items'
            AND column_name = 'calories'
          """)) {
        try (var result = statement.executeQuery()) {
          result.next();
          assertEquals(1, result.getInt(1));
        }
      }
    }
  }
}
