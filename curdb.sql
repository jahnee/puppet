-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: monitoring
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `klikbca`
--

DROP TABLE IF EXISTS `klikbca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `klikbca` (
  `Waktu_Test` datetime NOT NULL,
  `cek_saldo` varchar(20) DEFAULT 'Not Tested',
  `cek_transfer` varchar(20) DEFAULT 'Not Tested',
  `cek_mutasi` varchar(20) DEFAULT 'Not Tested',
  `return_error` varchar(20) DEFAULT 'Not Tested',
  `response` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klikbca`
--

LOCK TABLES `klikbca` WRITE;
/*!40000 ALTER TABLE `klikbca` DISABLE KEYS */;
INSERT INTO `klikbca` VALUES ('2024-04-03 10:31:18','success','Not_Tested','success','success','success'),('2024-04-03 10:39:39','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-03 10:41:47','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-03 12:31:34','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-09 16:55:37','success','Not_Tested','success','success','success'),('2024-04-09 16:56:18','success','Not_Tested','success','success','success'),('2024-04-09 17:02:04','success','Not_Tested','success','success','success'),('2024-04-09 17:04:56','success','Not_Tested','success','success','success'),('2024-04-09 17:13:50','success','Not_Tested','success','success','success'),('2024-04-09 17:16:09','success','Not_Tested','success','success','success'),('2024-04-09 17:18:21','success','Not_Tested','success','success','success'),('2024-04-09 17:25:18','success','Not_Tested','success','success','success'),('2024-04-09 17:28:48','success','Not_Tested','success','success','success'),('2024-04-09 17:33:29','success','Not_Tested','success','success','success'),('2024-04-09 17:35:02','success','Not_Tested','success','success','success'),('2024-04-09 18:30:22','success','Not_Tested','success','success','success'),('2024-04-09 18:34:45','success','success','success','success','success'),('2024-04-09 18:35:29','success','success','success','success','success'),('2024-04-09 18:36:13','success','success','success','success','success'),('2024-04-10 15:19:10','success','success','success','success','success'),('2024-04-10 15:19:47','success','success','success','success','success'),('2024-04-10 15:25:25','success','success','success','success','success'),('2024-04-10 16:14:58','success','success','error','Not_Tested','error'),('2024-04-10 16:23:54','success','success','success','success','success'),('2024-04-10 16:25:13','success','success','success','success','success'),('2024-04-10 16:25:31','success','success','success','success','success'),('2024-04-10 16:26:03','success','success','success','success','success'),('2024-04-10 16:26:20','success','success','success','success','success'),('2024-04-10 16:27:57','success','success','success','success','success'),('2024-04-10 16:28:08','success','success','success','success','success'),('2024-04-10 16:43:24','success','success','success','success','success'),('2024-04-10 19:52:40','success','success','success','success','success'),('2024-04-10 20:41:59','success','success','success','success','success'),('2024-04-10 20:43:06','error','success','success','Not_Tested','error'),('2024-04-10 20:43:48','success','success','success','success','success'),('2024-04-10 20:43:59','success','success','success','success','success'),('2024-04-10 20:46:36','success','success','success','success','success'),('2024-04-10 21:44:50','success','success','success','success','success'),('2024-04-10 21:45:12','success','success','success','success','success'),('2024-04-10 21:45:44','success','success','success','success','success'),('2024-04-10 21:52:49','success','success','success','success','success'),('2024-04-10 21:53:32','success','success','error','Not_Tested','error'),('2024-04-10 21:54:00','success','success','success','success','success'),('2024-04-10 21:54:32','success','success','success','success','success'),('2024-04-10 21:56:22','success','success','success','success','success'),('2024-04-10 21:56:55','success','success','success','success','success'),('2024-04-10 21:57:29','success','success','success','success','success'),('2024-04-10 21:58:28','success','success','error','Not_Tested','error'),('2024-04-10 23:16:04','success','success','success','success','success'),('2024-04-10 23:16:16','success','success','success','success','success'),('2024-04-10 23:17:22','success','success','success','success','success'),('2024-04-10 23:17:44','success','success','success','success','success'),('2024-04-10 23:18:55','success','success','success','success','success'),('2024-04-10 23:23:58','success','success','success','success','success'),('2024-04-10 23:51:23','success','success','success','success','success'),('2024-04-10 23:56:32','success','success','success','success','success'),('2024-04-11 00:01:40','success','success','success','success','success'),('2024-04-11 00:16:42','success','success','success','success','success'),('2024-04-11 00:21:28','success','success','success','success','success'),('2024-04-11 00:26:25','success','success','success','success','success'),('2024-04-11 00:35:42','success','success','success','success','success'),('2024-04-11 00:37:41','success','success','success','success','success'),('2024-04-11 00:38:41','success','success','success','success','success'),('2024-04-11 00:41:48','success','success','success','success','success'),('2024-04-11 00:43:43','success','success','success','success','success'),('2024-04-11 00:48:11','success','success','success','success','success'),('2024-04-11 21:15:50','success','success','success','success','success'),('2024-04-11 21:16:10','success','success','Not_Tested','success','success'),('2024-04-11 21:16:44','success','success','Not_Tested','success','success'),('2024-04-11 21:21:11','success','success','Not_Tested','success','success'),('2024-04-11 21:22:11','success','Not_Tested','Not_Tested','success','success'),('2024-04-11 21:26:55','success','success','Not_Tested','success','success'),('2024-04-11 23:44:48','success','success','Not_Tested','success','success'),('2024-04-12 01:12:31','success','success','Not_Tested','success','success'),('2024-04-12 01:13:06','success','success','Not_Tested','success','success'),('2024-04-12 01:28:52','success','success','Not_Tested','success','success'),('2024-04-12 02:20:45','success','success','Not_Tested','success','success'),('2024-04-15 17:35:55','success','success','success','success','success'),('2024-04-15 18:06:28','success','success','Not_Tested','success','success'),('2024-04-15 18:06:49','success','Not_Tested','success','success','success'),('2024-04-15 18:25:00','success','success','success','success','success'),('2024-04-15 18:31:34','success','Not_Tested','success','success','success'),('2024-04-15 18:32:24','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-15 19:09:23','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-15 19:17:19','success','Not_Tested','success','success','success'),('2024-04-15 19:23:01','success','Not_Tested','success','success','success'),('2024-04-15 19:30:02','success','Not_Tested','success','success','success'),('2024-04-15 19:35:08','success','Not_Tested','success','success','success'),('2024-04-15 20:04:32','success','Not_Tested','success','success','success'),('2024-04-15 20:22:27','success','Not_Tested','success','success','success'),('2024-04-15 22:08:07','success','Not_Tested','success','success','success'),('2024-04-15 22:09:04','success','success','success','success','success'),('2024-04-16 01:22:52','success','success','success','success','success'),('2024-04-16 13:36:26','success','success','success','success','success'),('2024-04-16 13:38:18','success','success','success','success','success'),('2024-04-16 13:39:17','success','success','success','success','success'),('2024-04-16 13:40:34','success','success','success','success','success'),('2024-04-16 13:45:11','success','success','success','success','success'),('2024-04-16 13:50:44','success','success','success','success','success'),('2024-04-16 13:55:47','success','success','success','success','success'),('2024-04-16 14:00:47','success','success','success','success','success'),('2024-04-16 14:05:48','success','success','success','success','success'),('2024-04-16 14:10:49','success','success','success','success','success'),('2024-04-16 14:15:46','success','success','success','success','success'),('2024-04-16 14:20:49','success','success','success','success','success'),('2024-04-16 14:25:45','success','success','success','success','success'),('2024-04-16 14:30:59','success','success','success','success','success'),('2024-04-16 14:35:50','success','success','success','success','success'),('2024-04-16 14:40:52','success','success','success','success','success'),('2024-04-16 14:46:55','error','success','error','Not_Tested','error'),('2024-04-16 14:50:49','success','success','success','success','success'),('2024-04-16 14:55:46','success','success','success','success','success'),('2024-04-16 15:01:19','success','success','error','Not_Tested','error'),('2024-04-16 15:05:50','success','success','success','success','success'),('2024-04-16 15:10:47','success','success','success','success','success'),('2024-04-16 15:15:50','success','success','success','success','success'),('2024-04-16 15:22:01','success','success','success','success','success'),('2024-04-16 15:25:50','success','success','success','success','success'),('2024-04-16 15:30:47','success','success','success','success','success'),('2024-04-16 15:35:48','success','success','success','success','success'),('2024-04-16 15:45:49','success','success','success','success','success'),('2024-04-16 15:50:49','success','success','success','success','success'),('2024-04-16 15:55:47','success','success','success','success','success'),('2024-04-16 16:00:48','success','success','success','success','success'),('2024-04-16 16:05:51','success','success','success','success','success'),('2024-04-16 16:20:50','success','success','success','success','success'),('2024-04-16 16:25:47','success','success','success','success','success'),('2024-04-16 16:36:06','success','success','success','success','success'),('2024-04-16 16:45:47','success','success','success','success','success'),('2024-04-16 16:57:00','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-16 16:59:07','Not Tested','Not Tested','Not Tested','Not Tested','login error'),('2024-04-16 17:00:11','success','success','success','success','success'),('2024-04-16 17:03:27','success','success','success','success','success'),('2024-04-16 17:04:45','success','success','success','success','success'),('2024-04-16 17:09:45','success','success','success','success','success'),('2024-04-16 17:13:55','success','Not_Tested','success','success','success'),('2024-04-16 17:38:14','success','Not_Tested','success','success','success'),('2024-04-16 17:44:49','success','Not_Tested','success','success','success'),('2024-04-16 17:46:53','success','success','success','success','success'),('2024-04-16 17:54:41','success','success','success','success','success'),('2024-04-16 17:59:41','success','success','success','success','success');
/*!40000 ALTER TABLE `klikbca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mybcamobile`
--

DROP TABLE IF EXISTS `mybcamobile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mybcamobile` (
  `Waktu_Test` datetime NOT NULL,
  `response` varchar(20) DEFAULT NULL,
  `transferSesama` varchar(20) DEFAULT 'Not Tested',
  `transferBeda` varchar(45) DEFAULT 'Not Tested'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mybcamobile`
--

LOCK TABLES `mybcamobile` WRITE;
/*!40000 ALTER TABLE `mybcamobile` DISABLE KEYS */;
INSERT INTO `mybcamobile` VALUES ('2024-04-05 13:49:14','failure','success','error'),('2024-04-05 13:50:57','failure','Not_Tested','error'),('2024-04-05 13:52:46','success','Not_Tested','success'),('2024-04-05 13:58:33','success','Not_Tested','success'),('2024-04-05 14:05:14','success','Not_Tested','success'),('2024-04-05 14:15:20','success','Not_Tested','success'),('2024-04-05 14:30:21','success','Not_Tested','success'),('2024-04-05 14:45:18','success','Not_Tested','success'),('2024-04-05 15:00:18','success','Not_Tested','success'),('2024-04-05 15:15:19','failure','Not_Tested','error'),('2024-04-17 10:23:42','failure','Not_Tested','error');
/*!40000 ALTER TABLE `mybcamobile` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-17 10:28:18
