package com.wodexplorer2.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestDatabaseConfiguration.class)
class BackendApplicationTests extends AbstractMySqlIntegrationTest {

	@Test
	void contextLoads() {
	}

}
