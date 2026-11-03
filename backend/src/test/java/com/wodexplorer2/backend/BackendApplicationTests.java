package com.wodexplorer2.backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.wodexplorer2.backend.repository.WodItemPrescriptionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestDatabaseConfiguration.class)
class BackendApplicationTests extends AbstractMySqlIntegrationTest {

	@Autowired
	private WodItemPrescriptionRepository wodItemPrescriptionRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void initializesPrescriptionRepositoryWithNestedAssociationQueries() {
		assertNotNull(wodItemPrescriptionRepository);
	}

}
