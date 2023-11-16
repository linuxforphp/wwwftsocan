-- MySQL dump 10.16  Distrib 10.2.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: lightmvctestdb
-- ------------------------------------------------------
-- Server version	10.2.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `networks`
--

DROP TABLE IF EXISTS `networks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `networks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chainidentifier` varchar(4) NOT NULL,
  `rpcurl` varchar(100) NOT NULL,
  `chainid` int(11) NOT NULL,
  `registrycontract` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `networks`
--

LOCK TABLES `networks` WRITE;
/*!40000 ALTER TABLE `networks` DISABLE KEYS */;
INSERT INTO `networks` VALUES (1,'SGB','http://sbi.sgb.ftsocan.com:9650/ext/bc/C/rpc',19,'0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019'),(2,'FLR','http://sbi.flr.ftsocan.com:9650/ext/bc/C/rpc',14,'0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019');
/*!40000 ALTER TABLE `networks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sgbcontracts`
--

DROP TABLE IF EXISTS `sgbcontracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sgbcontracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contractname` varchar(32) NOT NULL,
  `contractabi` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sgbcontracts`
--

LOCK TABLES `sgbcontracts` WRITE;
/*!40000 ALTER TABLE `sgbcontracts` DISABLE KEYS */;
INSERT INTO `sgbcontracts` VALUES (1,'WNat','WNat.json'),(2,'ClaimSetupManager','ClaimSetupManager.json'),(3,'FtsoRewardManager','FtsoRewardManager.json'),(4,'VoterWhitelister','VoterWhitelister.json');
/*!40000 ALTER TABLE `sgbcontracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventlog`
--

DROP TABLE IF EXISTS `eventlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `parameters` varchar(5000) NOT NULL,
  `created` TIMESTAMP,
  `occurred` TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-14 12:47:51
