-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: wod_explorer_2
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercise_results`
--

DROP TABLE IF EXISTS `exercise_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_results` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `exercise_id` bigint unsigned NOT NULL,
  `reps` int unsigned DEFAULT NULL,
  `weight_kg` decimal(8,3) DEFAULT NULL,
  `distance_m` decimal(10,2) DEFAULT NULL,
  `duration_seconds` int unsigned DEFAULT NULL,
  `performed_at` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `exercise_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `exercise_results_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  CONSTRAINT `exercise_results_chk_1` CHECK (((`reps` is not null) or (`weight_kg` is not null) or (`distance_m` is not null) or (`duration_seconds` is not null)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_results`
--

LOCK TABLES `exercise_results` WRITE;
/*!40000 ALTER TABLE `exercise_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercise_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(30) NOT NULL,
  `measurement_type` varchar(30) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  CONSTRAINT `exercises_chk_1` CHECK ((`category` in (_utf8mb4'WEIGHTLIFTING',_utf8mb4'GYMNASTICS',_utf8mb4'STRONGMAN',_utf8mb4'CARDIO',_utf8mb4'OTHER'))),
  CONSTRAINT `exercises_chk_2` CHECK ((`measurement_type` in (_utf8mb4'WEIGHT',_utf8mb4'REPS',_utf8mb4'TIME',_utf8mb4'DISTANCE',_utf8mb4'WEIGHT_DISTANCE',_utf8mb4'OTHER')))
) ENGINE=InnoDB AUTO_INCREMENT=359 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,'Back Squat','WEIGHTLIFTING','WEIGHT',1),(2,'Bench Press','WEIGHTLIFTING','WEIGHT',1),(3,'Squat Clean','WEIGHTLIFTING','WEIGHT',1),(4,'Clean & Jerk','WEIGHTLIFTING','WEIGHT',1),(5,'Deadlift','WEIGHTLIFTING','WEIGHT',1),(6,'Front Squat','WEIGHTLIFTING','WEIGHT',1),(7,'Push Jerk','WEIGHTLIFTING','WEIGHT',1),(8,'One-handed Snatch','WEIGHTLIFTING','WEIGHT',1),(9,'Overhead Squat','WEIGHTLIFTING','WEIGHT',1),(10,'Power Clean','WEIGHTLIFTING','WEIGHT',1),(11,'Power Snatch','WEIGHTLIFTING','WEIGHT',1),(12,'Push Press','WEIGHTLIFTING','WEIGHT',1),(13,'Shoulder Press','WEIGHTLIFTING','WEIGHT',1),(14,'Squat Snatch','WEIGHTLIFTING','WEIGHT',1),(15,'Thruster','WEIGHTLIFTING','WEIGHT',1),(16,'Turkish Get-up','GYMNASTICS','WEIGHT',1),(17,'Weighted Pull-up','GYMNASTICS','WEIGHT',1),(18,'Pistol Squat','GYMNASTICS','REPS',1),(19,'Hang Squat Clean','WEIGHTLIFTING','WEIGHT',1),(20,'Hang Power Clean','WEIGHTLIFTING','WEIGHT',1),(21,'Hang Squat Snatch','WEIGHTLIFTING','WEIGHT',1),(22,'Hang Power Snatch','WEIGHTLIFTING','WEIGHT',1),(23,'Cluster','WEIGHTLIFTING','WEIGHT',1),(24,'Floor Press','WEIGHTLIFTING','WEIGHT',1),(25,'Sumo Deadlift','WEIGHTLIFTING','WEIGHT',1),(26,'Split Jerk','WEIGHTLIFTING','WEIGHT',1),(27,'Bent Row','WEIGHTLIFTING','WEIGHT',1),(28,'Box Squat Below Parallel','WEIGHTLIFTING','WEIGHT',1),(29,'Box Squat Above Parallel','WEIGHTLIFTING','WEIGHT',1),(30,'Hip Thrust','WEIGHTLIFTING','WEIGHT',1),(31,'Barbell Lunges','WEIGHTLIFTING','WEIGHT',1),(32,'Push Up','GYMNASTICS','REPS',1),(33,'Good Morning','WEIGHTLIFTING','WEIGHT',1),(34,'Good Morning Halterofilia','WEIGHTLIFTING','WEIGHT',1),(35,'High Power Snatch','WEIGHTLIFTING','WEIGHT',1),(36,'High Squat Snatch','WEIGHTLIFTING','WEIGHT',1),(37,'Snatch Deadlift','WEIGHTLIFTING','WEIGHT',1),(38,'Sumo Deadlift High Pull','WEIGHTLIFTING','WEIGHT',1),(39,'Muscle Snatch','WEIGHTLIFTING','WEIGHT',1),(40,'Hang Muscle Snatch','WEIGHTLIFTING','WEIGHT',1),(41,'Overhead Lunges','WEIGHTLIFTING','WEIGHT',1),(42,'Muscle Clean','WEIGHTLIFTING','WEIGHT',1),(43,'Snatch Balance','WEIGHTLIFTING','WEIGHT',1),(44,'Weighted Chest to Bar','GYMNASTICS','WEIGHT',1),(45,'Bench Row','WEIGHTLIFTING','WEIGHT',1),(46,'Seal Row','WEIGHTLIFTING','WEIGHT',1),(47,'Pendlay Row','WEIGHTLIFTING','WEIGHT',1),(48,'Power Cluster','WEIGHTLIFTING','WEIGHT',1),(49,'Snatch Push Press','WEIGHTLIFTING','WEIGHT',1),(50,'Back Squat Barra Baja','WEIGHTLIFTING','WEIGHT',1),(51,'Semi Sumo Deadlift','WEIGHTLIFTING','WEIGHT',1),(52,'Safety Bar Squat','WEIGHTLIFTING','WEIGHT',1),(53,'Trap Bar Deadlift','WEIGHTLIFTING','WEIGHT',1),(54,'Rack Pull','WEIGHTLIFTING','WEIGHT',1),(55,'Weighted Pull-Up Supina','GYMNASTICS','WEIGHT',1),(56,'Narrow Grip Bench Press','WEIGHTLIFTING','WEIGHT',1),(57,'Inclined Bench Press','WEIGHTLIFTING','WEIGHT',1),(58,'Biceps Curl Barbell','OTHER','WEIGHT',1),(59,'Slightly Inclined Shoulder Press Mancuernas','OTHER','WEIGHT',1),(60,'Straight Seated Shoulder Press','OTHER','WEIGHT',1),(61,'Slightly Inclined Shoulder Press Barra','OTHER','WEIGHT',1),(62,'Kettlebell Lunge','OTHER','WEIGHT',1),(63,'Dumbbell Lunges','OTHER','WEIGHT',1),(64,'Glute Bridge Bar','OTHER','WEIGHT',1),(65,'Romanian Deadlift','WEIGHTLIFTING','WEIGHT',1),(66,'Strict Press','WEIGHTLIFTING','WEIGHT',1),(67,'High Hang Power Snatch','WEIGHTLIFTING','WEIGHT',1),(68,'High Hang Squat Snatch','WEIGHTLIFTING','WEIGHT',1),(69,'Low Hang Power Snatch','WEIGHTLIFTING','WEIGHT',1),(70,'Low Hang Squat Snatch','WEIGHTLIFTING','WEIGHT',1),(71,'High Hang Power Clean','WEIGHTLIFTING','WEIGHT',1),(72,'High Hang Squat Clean','WEIGHTLIFTING','WEIGHT',1),(73,'Low Hang Power Clean','WEIGHTLIFTING','WEIGHT',1),(74,'Low Hang Squat Clean','WEIGHTLIFTING','WEIGHT',1),(75,'Zercher Squat','WEIGHTLIFTING','WEIGHT',1),(76,'Front Rack Lunges','WEIGHTLIFTING','WEIGHT',1),(77,'Bulgarian Squat','WEIGHTLIFTING','WEIGHT',1),(78,'Farmer Carry 15m','STRONGMAN','WEIGHT_DISTANCE',1),(79,'Yoke Carry 15m','STRONGMAN','WEIGHT_DISTANCE',1),(80,'Sandbag Clean','STRONGMAN','WEIGHT',1),(81,'Back Rack Reverse Lunge','WEIGHTLIFTING','WEIGHT',1),(82,'Grip Strength','STRONGMAN','WEIGHT',1),(83,'Trap Bar Squat','WEIGHTLIFTING','WEIGHT',1),(84,'Weighted Push Up','GYMNASTICS','WEIGHT',1),(85,'Weighted Chin Up','GYMNASTICS','WEIGHT',1),(86,'Pulldown Polea','OTHER','WEIGHT',1),(87,'Sled Push','STRONGMAN','WEIGHT_DISTANCE',1),(88,'Sled Pull','STRONGMAN','WEIGHT_DISTANCE',1),(89,'Weighted Ring Push Up','GYMNASTICS','WEIGHT',1),(90,'Weighted Dips','GYMNASTICS','WEIGHT',1),(91,'Bench Press Dumbbells','WEIGHTLIFTING','WEIGHT',1),(92,'Low Row','OTHER','WEIGHT',1),(93,'Landmine Press','WEIGHTLIFTING','WEIGHT',1),(94,'Renegade Row','WEIGHTLIFTING','WEIGHT',1),(95,'Sled Drag','STRONGMAN','WEIGHT_DISTANCE',1),(96,'Pendulum Press','WEIGHTLIFTING','WEIGHT',1),(97,'Dumbbell Thruster','WEIGHTLIFTING','WEIGHT',1),(98,'Curl Bíceps 45°','OTHER','WEIGHT',1),(99,'Extensión de Tríceps Katana','OTHER','WEIGHT',1),(100,'Cruces Invertidas','OTHER','WEIGHT',1),(101,'Cruces en Polea Pectoral Sentado','OTHER','WEIGHT',1),(102,'Cruces en Polea Pectoral de Pie','OTHER','WEIGHT',1),(103,'Sissy Squat','OTHER','REPS',1),(104,'Split Squat','OTHER','REPS',1),(105,'Crunch Invertido','GYMNASTICS','REPS',1),(106,'Leg Curl Tumbado','OTHER','WEIGHT',1),(107,'Leg Curl de Pie','OTHER','WEIGHT',1),(108,'40m DB Farmer Carry','STRONGMAN','WEIGHT_DISTANCE',1),(109,'GHD Sit-Ups','GYMNASTICS','REPS',1),(110,'Javelin Press','WEIGHTLIFTING','WEIGHT',1),(111,'Clean Pull','WEIGHTLIFTING','WEIGHT',1),(112,'Run','CARDIO','DISTANCE',1),(113,'Row','CARDIO','DISTANCE',1),(114,'Swim','CARDIO','DISTANCE',1),(115,'Double Under','CARDIO','REPS',1),(116,'Single Under','CARDIO','REPS',1),(117,'Pull-up','GYMNASTICS','REPS',1),(118,'Chest to Bar Pull-up','GYMNASTICS','REPS',1),(119,'Muscle-up','GYMNASTICS','REPS',1),(120,'Ring Muscle-up','GYMNASTICS','REPS',1),(121,'Handstand Push-up','GYMNASTICS','REPS',1),(122,'Handstand Walk','GYMNASTICS','DISTANCE',1),(123,'Parallel Handstand Push-up','GYMNASTICS','REPS',1),(124,'Burpee','GYMNASTICS','REPS',1),(125,'Bar-facing Burpee','GYMNASTICS','REPS',1),(126,'Burpee Pull-up','GYMNASTICS','REPS',1),(127,'Burpee Box Jump','GYMNASTICS','REPS',1),(128,'Box Jump','GYMNASTICS','REPS',1),(129,'Box Jump Over','GYMNASTICS','REPS',1),(130,'Broad Jump','GYMNASTICS','REPS',1),(131,'Standing Broad Jump','GYMNASTICS','REPS',1),(132,'Air Squat','GYMNASTICS','REPS',1),(133,'Squat','GYMNASTICS','REPS',1),(134,'Sit-up','GYMNASTICS','REPS',1),(135,'AbMat Sit-up','GYMNASTICS','REPS',1),(136,'Knees to Elbows','GYMNASTICS','REPS',1),(137,'Toes to Bar','GYMNASTICS','REPS',1),(138,'Rope Climb','GYMNASTICS','REPS',1),(139,'Legless Rope Climb','GYMNASTICS','REPS',1),(140,'Ring Push-up','GYMNASTICS','REPS',1),(141,'Ring Row','GYMNASTICS','REPS',1),(142,'Bear Crawl','GYMNASTICS','DISTANCE',1),(143,'Wall Ball','WEIGHTLIFTING','REPS',1),(144,'Medicine Ball Clean','WEIGHTLIFTING','WEIGHT',1),(145,'Medicine Ball Run','WEIGHTLIFTING','WEIGHT_DISTANCE',1),(146,'Kettlebell Swing','WEIGHTLIFTING','WEIGHT',1),(147,'Kettlebell Clean and Jerk','WEIGHTLIFTING','WEIGHT',1),(148,'Kettlebell Front Squat','WEIGHTLIFTING','WEIGHT',1),(149,'Dumbbell Snatch','WEIGHTLIFTING','WEIGHT',1),(150,'Dumbbell Hang Squat Clean','WEIGHTLIFTING','WEIGHT',1),(151,'Dumbbell Hang Split Snatch','WEIGHTLIFTING','WEIGHT',1),(152,'Dumbbell Split Clean','WEIGHTLIFTING','WEIGHT',1),(153,'Dumbbell Deadlift','WEIGHTLIFTING','WEIGHT',1),(154,'Walking Lunge','GYMNASTICS','REPS',1),(155,'Walking Lunge Weighted','WEIGHTLIFTING','WEIGHT',1),(156,'Sandbag Carry','STRONGMAN','WEIGHT_DISTANCE',1),(157,'Box Extension','OTHER','REPS',1),(158,'Bar Muscle-up','GYMNASTICS','REPS',1),(159,'Strict Pull-up','GYMNASTICS','REPS',1),(160,'Strict Chest-to-Bar Pull-up','GYMNASTICS','REPS',1),(161,'Strict Ring Dip','GYMNASTICS','REPS',1),(162,'Ring Dip','GYMNASTICS','REPS',1),(163,'Deficit Handstand Push-up','GYMNASTICS','REPS',1),(164,'Hand-release Push-up','GYMNASTICS','REPS',1),(165,'Shuttle Run','CARDIO','DISTANCE',1),(166,'Shuttle Sprint','CARDIO','DISTANCE',1),(167,'Back Extension','GYMNASTICS','REPS',1),(168,'Mountain Climber','GYMNASTICS','REPS',1),(169,'Shoulder-to-Overhead','WEIGHTLIFTING','WEIGHT',1),(170,'Waiter Walk','STRONGMAN','WEIGHT_DISTANCE',1),(171,'Waiter Carry','STRONGMAN','WEIGHT_DISTANCE',1),(172,'Buddy Carry','STRONGMAN','DISTANCE',1),(173,'Single-arm Barbell Farmer Carry','STRONGMAN','WEIGHT_DISTANCE',1),(174,'Running Farmer Carry','STRONGMAN','WEIGHT_DISTANCE',1),(175,'Farmer Walk','STRONGMAN','WEIGHT_DISTANCE',1),(176,'Barbell Hack Squat','WEIGHTLIFTING','WEIGHT',1),(177,'Clean','WEIGHTLIFTING','WEIGHT',1),(178,'Forward Roll','GYMNASTICS','REPS',1),(179,'Wall Climb','GYMNASTICS','REPS',1);
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wod_results`
--

DROP TABLE IF EXISTS `wod_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_results` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `wod_version_id` bigint unsigned NOT NULL,
  `performed_at` datetime(6) NOT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  `time_seconds` int unsigned DEFAULT NULL,
  `progress_rounds` int unsigned DEFAULT NULL,
  `progress_item_id` bigint unsigned DEFAULT NULL,
  `progress_reps` int unsigned DEFAULT NULL,
  `progress_distance_m` decimal(10,2) DEFAULT NULL,
  `progress_duration_seconds` int unsigned DEFAULT NULL,
  `amrap_rounds` int unsigned DEFAULT NULL,
  `amrap_extra_reps` int unsigned DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `wod_version_id` (`wod_version_id`),
  KEY `progress_item_id` (`progress_item_id`),
  CONSTRAINT `wod_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `wod_results_ibfk_2` FOREIGN KEY (`wod_version_id`) REFERENCES `wod_versions` (`id`),
  CONSTRAINT `wod_results_ibfk_3` FOREIGN KEY (`progress_item_id`) REFERENCES `wod_version_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wod_results`
--

LOCK TABLES `wod_results` WRITE;
/*!40000 ALTER TABLE `wod_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `wod_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wod_version_items`
--

DROP TABLE IF EXISTS `wod_version_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_version_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wod_version_id` bigint unsigned NOT NULL,
  `exercise_id` bigint unsigned NOT NULL,
  `position` int unsigned NOT NULL,
  `reps` int unsigned DEFAULT NULL,
  `weight_kg` decimal(8,3) DEFAULT NULL,
  `distance_m` decimal(10,2) DEFAULT NULL,
  `duration_seconds` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wod_version_id` (`wod_version_id`,`position`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `wod_version_items_ibfk_1` FOREIGN KEY (`wod_version_id`) REFERENCES `wod_versions` (`id`),
  CONSTRAINT `wod_version_items_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  CONSTRAINT `wod_version_items_chk_1` CHECK (((`reps` is not null) or (`weight_kg` is not null) or (`distance_m` is not null) or (`duration_seconds` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wod_version_items`
--

LOCK TABLES `wod_version_items` WRITE;
/*!40000 ALTER TABLE `wod_version_items` DISABLE KEYS */;
INSERT INTO `wod_version_items` VALUES (2,23,5,1,12,70.000,NULL,NULL),(3,24,5,1,12,70.000,NULL,NULL),(5,23,20,2,9,70.000,NULL,NULL),(6,24,20,2,9,70.000,NULL,NULL),(8,23,7,3,6,70.000,NULL,NULL),(9,24,7,3,6,70.000,NULL,NULL),(11,25,112,1,NULL,NULL,400.00,NULL),(12,25,146,2,21,24.000,NULL,NULL),(13,25,117,3,12,NULL,NULL,NULL),(14,26,117,1,5,NULL,NULL,NULL),(15,26,32,2,10,NULL,NULL,NULL),(16,26,132,3,15,NULL,NULL,NULL),(17,27,15,1,21,43.000,NULL,NULL),(18,27,117,2,21,NULL,NULL,NULL),(19,27,15,3,15,43.000,NULL,NULL),(20,27,117,4,15,NULL,NULL,NULL),(21,27,15,5,9,43.000,NULL,NULL),(22,27,117,6,9,NULL,NULL,NULL),(23,28,115,1,50,NULL,NULL,NULL),(24,28,134,2,50,NULL,NULL,NULL),(25,28,115,3,40,NULL,NULL,NULL),(26,28,134,4,40,NULL,NULL,NULL),(27,28,115,5,30,NULL,NULL,NULL),(28,28,134,6,30,NULL,NULL,NULL),(29,28,115,7,20,NULL,NULL,NULL),(30,28,134,8,20,NULL,NULL,NULL),(31,28,115,9,10,NULL,NULL,NULL),(32,28,134,10,10,NULL,NULL,NULL),(33,29,124,1,10,NULL,NULL,NULL);
/*!40000 ALTER TABLE `wod_version_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wod_versions`
--

DROP TABLE IF EXISTS `wod_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_versions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `wod_id` bigint unsigned NOT NULL,
  `version_number` int unsigned NOT NULL,
  `type` varchar(20) NOT NULL,
  `time_cap_seconds` int unsigned DEFAULT NULL,
  `rounds` int unsigned DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `wod_id` (`wod_id`,`version_number`),
  CONSTRAINT `wod_versions_ibfk_1` FOREIGN KEY (`wod_id`) REFERENCES `wods` (`id`),
  CONSTRAINT `wod_versions_chk_1` CHECK ((`type` in (_utf8mb4'FOR_TIME',_utf8mb4'AMRAP',_utf8mb4'EMOM'))),
  CONSTRAINT `wod_versions_chk_2` CHECK (((`type` = _utf8mb4'FOR_TIME') or (`time_cap_seconds` is not null))),
  CONSTRAINT `wod_versions_chk_3` CHECK (((`type` = _utf8mb4'FOR_TIME') or (`rounds` is null)))
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wod_versions`
--

LOCK TABLES `wod_versions` WRITE;
/*!40000 ALTER TABLE `wod_versions` DISABLE KEYS */;
INSERT INTO `wod_versions` VALUES (23,23,1,'FOR_TIME',NULL,5,'2026-09-23 13:07:22.533001'),(24,24,1,'FOR_TIME',NULL,5,'2026-09-23 13:07:22.533001'),(25,25,1,'FOR_TIME',NULL,3,'2026-09-23 13:07:22.533001'),(26,26,1,'AMRAP',1200,NULL,'2026-09-23 13:07:22.533001'),(27,27,1,'FOR_TIME',NULL,NULL,'2026-09-23 13:07:22.533001'),(28,28,1,'FOR_TIME',NULL,NULL,'2026-09-23 13:07:22.533001'),(29,29,1,'EMOM',600,NULL,'2026-09-23 13:07:22.533001');
/*!40000 ALTER TABLE `wod_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wods`
--

DROP TABLE IF EXISTS `wods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` bigint unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `origin` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `wods_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `wods_chk_1` CHECK ((`origin` in (_utf8mb4'GENERIC',_utf8mb4'PERSONAL'))),
  CONSTRAINT `wods_chk_2` CHECK ((((`origin` = _utf8mb4'GENERIC') and (`owner_id` is null)) or ((`origin` = _utf8mb4'PERSONAL') and (`owner_id` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wods`
--

LOCK TABLES `wods` WRITE;
/*!40000 ALTER TABLE `wods` DISABLE KEYS */;
INSERT INTO `wods` VALUES (23,NULL,'DT','GENERIC','2026-09-23 13:02:13.361356',NULL),(24,NULL,'DT','GENERIC','2026-09-23 13:07:01.182841',NULL),(25,NULL,'Helen','GENERIC','2026-09-23 13:07:01.182841',NULL),(26,NULL,'Cindy','GENERIC','2026-09-23 13:07:01.182841',NULL),(27,NULL,'Fran','GENERIC','2026-09-23 13:07:01.182841',NULL),(28,NULL,'Annie','GENERIC','2026-09-23 13:07:01.182841',NULL),(29,NULL,'Test EMOM','GENERIC','2026-09-23 13:07:01.182841',NULL);
/*!40000 ALTER TABLE `wods` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23 16:50:07
