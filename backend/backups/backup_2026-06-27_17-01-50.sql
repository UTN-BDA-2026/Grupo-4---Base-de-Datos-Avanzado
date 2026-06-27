-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: music_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),(25,'Can add Outstanding Token',7,'add_outstandingtoken'),(26,'Can change Outstanding Token',7,'change_outstandingtoken'),(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),(28,'Can view Outstanding Token',7,'view_outstandingtoken'),(29,'Can add Artista',9,'add_artist'),(30,'Can change Artista',9,'change_artist'),(31,'Can delete Artista',9,'delete_artist'),(32,'Can view Artista',9,'view_artist'),(33,'Can add album',8,'add_album'),(34,'Can change album',8,'change_album'),(35,'Can delete album',8,'delete_album'),(36,'Can view album',8,'view_album'),(37,'Can add song',10,'add_song'),(38,'Can change song',10,'change_song'),(39,'Can delete song',10,'delete_song'),(40,'Can view song',10,'view_song'),(41,'Can add Usuario',12,'add_user'),(42,'Can change Usuario',12,'change_user'),(43,'Can delete Usuario',12,'delete_user'),(44,'Can view Usuario',12,'view_user'),(45,'Can add listening history',11,'add_listeninghistory'),(46,'Can change listening history',11,'change_listeninghistory'),(47,'Can delete listening history',11,'delete_listeninghistory'),(48,'Can view listening history',11,'view_listeninghistory'),(49,'Can add Biblioteca de Usuario',13,'add_userlibrary'),(50,'Can change Biblioteca de Usuario',13,'change_userlibrary'),(51,'Can delete Biblioteca de Usuario',13,'delete_userlibrary'),(52,'Can view Biblioteca de Usuario',13,'view_userlibrary'),(53,'Can add playlist',14,'add_playlist'),(54,'Can change playlist',14,'change_playlist'),(55,'Can delete playlist',14,'delete_playlist'),(56,'Can view playlist',14,'view_playlist'),(57,'Can add playlist song',15,'add_playlistsong'),(58,'Can change playlist song',15,'change_playlistsong'),(59,'Can delete playlist song',15,'delete_playlistsong'),(60,'Can view playlist song',15,'view_playlistsong');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'contenttypes','contenttype'),(8,'music','album'),(9,'music','artist'),(10,'music','song'),(14,'playlists','playlist'),(15,'playlists','playlistsong'),(5,'sessions','session'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken'),(11,'users','listeninghistory'),(12,'users','user'),(13,'users','userlibrary');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'music','0001_initial','2026-06-26 18:00:57.831649'),(2,'contenttypes','0001_initial','2026-06-26 18:00:58.195402'),(3,'contenttypes','0002_remove_content_type_name','2026-06-26 18:01:00.368647'),(4,'auth','0001_initial','2026-06-26 18:01:02.686576'),(5,'auth','0002_alter_permission_name_max_length','2026-06-26 18:01:02.985471'),(6,'auth','0003_alter_user_email_max_length','2026-06-26 18:01:03.005115'),(7,'auth','0004_alter_user_username_opts','2026-06-26 18:01:03.032418'),(8,'auth','0005_alter_user_last_login_null','2026-06-26 18:01:03.076937'),(9,'auth','0006_require_contenttypes_0002','2026-06-26 18:01:03.099807'),(10,'auth','0007_alter_validators_add_error_messages','2026-06-26 18:01:03.131695'),(11,'auth','0008_alter_user_username_max_length','2026-06-26 18:01:03.170483'),(12,'auth','0009_alter_user_last_name_max_length','2026-06-26 18:01:03.210382'),(13,'auth','0010_alter_group_name_max_length','2026-06-26 18:01:03.280786'),(14,'auth','0011_update_proxy_permissions','2026-06-26 18:01:03.307144'),(15,'auth','0012_alter_user_first_name_max_length','2026-06-26 18:01:03.346613'),(16,'users','0001_initial','2026-06-26 18:01:06.521515'),(17,'admin','0001_initial','2026-06-26 18:01:07.138994'),(18,'admin','0002_logentry_remove_auto_add','2026-06-26 18:01:07.172122'),(19,'admin','0003_logentry_add_action_flag_choices','2026-06-26 18:01:07.204448'),(20,'music','0002_album_popularity','2026-06-26 18:01:07.505453'),(21,'playlists','0001_initial','2026-06-26 18:01:07.702138'),(22,'playlists','0002_initial','2026-06-26 18:01:09.002021'),(23,'sessions','0001_initial','2026-06-26 18:01:09.166683'),(24,'token_blacklist','0001_initial','2026-06-26 18:01:09.889564'),(25,'token_blacklist','0002_outstandingtoken_jti_hex','2026-06-26 18:01:10.133772'),(26,'token_blacklist','0003_auto_20171017_2007','2026-06-26 18:01:10.188689'),(27,'token_blacklist','0004_auto_20171017_2013','2026-06-26 18:01:10.484318'),(28,'token_blacklist','0005_remove_outstandingtoken_jti','2026-06-26 18:01:10.724947'),(29,'token_blacklist','0006_auto_20171017_2113','2026-06-26 18:01:10.838579'),(30,'token_blacklist','0007_auto_20171017_2214','2026-06-26 18:01:11.734812'),(31,'token_blacklist','0008_migrate_to_bigautofield','2026-06-26 18:01:13.041400'),(32,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-06-26 18:01:13.098842'),(33,'token_blacklist','0011_linearizes_history','2026-06-26 18:01:13.113071'),(34,'token_blacklist','0012_alter_outstandingtoken_user','2026-06-26 18:01:13.171078'),(35,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-06-26 18:01:13.233586');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_album`
--

DROP TABLE IF EXISTS `music_album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_album` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deezer_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `release_date` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `album_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_tracks` int NOT NULL,
  `artist_id` bigint NOT NULL,
  `popularity` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deezer_id` (`deezer_id`),
  KEY `music_album_name_d80369_idx` (`name`),
  KEY `music_album_release_5ffcba_idx` (`release_date`),
  KEY `music_album_artist__e74ad4_idx` (`artist_id`,`release_date`),
  KEY `music_album_album_t_b7fecc_idx` (`album_type`,`release_date`),
  CONSTRAINT `music_album_artist_id_f633b817_fk_music_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `music_artist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_album`
--

LOCK TABLES `music_album` WRITE;
/*!40000 ALTER TABLE `music_album` DISABLE KEYS */;
/*!40000 ALTER TABLE `music_album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_artist`
--

DROP TABLE IF EXISTS `music_artist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_artist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deezer_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genres` json NOT NULL,
  `followers` int NOT NULL,
  `popularity` int NOT NULL,
  `fetched_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deezer_id` (`deezer_id`),
  KEY `music_artis_name_e97718_idx` (`name`),
  KEY `music_artis_popular_80e400_idx` (`popularity`),
  KEY `music_artis_followe_60cee3_idx` (`followers`),
  KEY `music_artis_name_1df5b4_idx` (`name`,`popularity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_artist`
--

LOCK TABLES `music_artist` WRITE;
/*!40000 ALTER TABLE `music_artist` DISABLE KEYS */;
/*!40000 ALTER TABLE `music_artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `music_song`
--

DROP TABLE IF EXISTS `music_song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `music_song` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deezer_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_ms` int NOT NULL,
  `track_number` int NOT NULL,
  `popularity` int NOT NULL,
  `preview_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `album_id` bigint NOT NULL,
  `artist_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deezer_id` (`deezer_id`),
  KEY `music_song_title_8e56ff_idx` (`title`),
  KEY `music_song_popular_af7fb0_idx` (`popularity`),
  KEY `music_song_artist__fc092c_idx` (`artist_id`,`popularity`),
  KEY `music_song_album_id_62a413c8_fk_music_album_id` (`album_id`),
  CONSTRAINT `music_song_album_id_62a413c8_fk_music_album_id` FOREIGN KEY (`album_id`) REFERENCES `music_album` (`id`),
  CONSTRAINT `music_song_artist_id_175733ea_fk_music_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `music_artist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `music_song`
--

LOCK TABLES `music_song` WRITE;
/*!40000 ALTER TABLE `music_song` DISABLE KEYS */;
/*!40000 ALTER TABLE `music_song` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists_playlist`
--

DROP TABLE IF EXISTS `playlists_playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists_playlist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_public` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlists_p_user_id_acd1c7_idx` (`user_id`,`is_public`),
  KEY `playlists_p_user_id_548a36_idx` (`user_id`,`updated_at`),
  KEY `playlists_p_name_c54c4e_idx` (`name`),
  CONSTRAINT `playlists_playlist_user_id_155248c5_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists_playlist`
--

LOCK TABLES `playlists_playlist` WRITE;
/*!40000 ALTER TABLE `playlists_playlist` DISABLE KEYS */;
INSERT INTO `playlists_playlist` VALUES (1,'rap','','',0,'2026-06-27 14:35:56.306145','2026-06-27 14:35:56.306206',1);
/*!40000 ALTER TABLE `playlists_playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists_playlistsong`
--

DROP TABLE IF EXISTS `playlists_playlistsong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists_playlistsong` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `position` int unsigned NOT NULL,
  `added_at` datetime(6) NOT NULL,
  `playlist_id` bigint NOT NULL,
  `song_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `playlists_playlistsong_playlist_id_song_id_da877830_uniq` (`playlist_id`,`song_id`),
  KEY `playlists_playlistsong_song_id_9c84d667_fk_music_song_id` (`song_id`),
  KEY `playlists_p_playlis_fca9f3_idx` (`playlist_id`,`position`),
  CONSTRAINT `playlists_playlistso_playlist_id_c568f66c_fk_playlists` FOREIGN KEY (`playlist_id`) REFERENCES `playlists_playlist` (`id`),
  CONSTRAINT `playlists_playlistsong_song_id_9c84d667_fk_music_song_id` FOREIGN KEY (`song_id`) REFERENCES `music_song` (`id`),
  CONSTRAINT `playlists_playlistsong_chk_1` CHECK ((`position` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists_playlistsong`
--

LOCK TABLES `playlists_playlistsong` WRITE;
/*!40000 ALTER TABLE `playlists_playlistsong` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists_playlistsong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_users_use` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_users_use` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzEwNjI0NywiaWF0IjoxNzgyNTAxNDQ3LCJqdGkiOiIyMTNkZTE1MzRmNDc0NDAyYjJmMGYwYmU0ZDFlYTA4MiIsInVzZXJfaWQiOiIxIn0.dgZQ-0a8FFQVPlzIRY1QzP1v6L7P1XTj4amAPrYJXbI','2026-06-26 19:17:27.452443','2026-07-03 19:17:27.000000',1,'213de1534f474402b2f0f0be4d1ea082'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4MzE3NTY5OCwiaWF0IjoxNzgyNTcwODk4LCJqdGkiOiI5OWIxMDdlYjI2N2U0YjUzOGVjNDU5OTFmNTkyOTI3MyIsInVzZXJfaWQiOiIxIn0.8RM7AjDJWKMHFMouMFlPjRhgC6PO4_SCm9aJRAHfP8s','2026-06-27 14:34:58.895639','2026-07-04 14:34:58.000000',1,'99b107eb267e4b538ec45991f5929273');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_listeninghistory`
--

DROP TABLE IF EXISTS `users_listeninghistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_listeninghistory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `played_at` datetime(6) NOT NULL,
  `song_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_liste_user_id_f5a77e_idx` (`user_id`),
  KEY `users_liste_song_id_678e9b_idx` (`song_id`),
  KEY `users_liste_played__16c1f6_idx` (`played_at`),
  KEY `users_liste_user_id_09d238_idx` (`user_id`,`played_at`),
  KEY `users_liste_song_id_4cc726_idx` (`song_id`,`user_id`),
  CONSTRAINT `users_listeninghistory_song_id_9b2fb094_fk_music_song_id` FOREIGN KEY (`song_id`) REFERENCES `music_song` (`id`),
  CONSTRAINT `users_listeninghistory_user_id_05da96fb_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_listeninghistory`
--

LOCK TABLES `users_listeninghistory` WRITE;
/*!40000 ALTER TABLE `users_listeninghistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_listeninghistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user`
--

DROP TABLE IF EXISTS `users_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES (1,'pbkdf2_sha256$1200000$jzRLGaqwPTXMk98O2597wQ$S98haEbU7avhVx3iLnVf3ueZoP10xAWhUpZqoLVxoFM=',NULL,0,'Gabi','','',0,1,'2026-06-26 19:17:23.355082','relyckon4188@gmail.com');
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_groups`
--

DROP TABLE IF EXISTS `users_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_groups_user_id_group_id_b88eab82_uniq` (`user_id`,`group_id`),
  KEY `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_user_groups_user_id_5f6f5a90_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_groups`
--

LOCK TABLES `users_user_groups` WRITE;
/*!40000 ALTER TABLE `users_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_user_permissions`
--

DROP TABLE IF EXISTS `users_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_user_permissions_user_id_permission_id_43338c45_uniq` (`user_id`,`permission_id`),
  KEY `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_user_permissions_user_id_20aca447_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_user_permissions`
--

LOCK TABLES `users_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_userlibrary`
--

DROP TABLE IF EXISTS `users_userlibrary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_userlibrary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `saved_at` datetime(6) NOT NULL,
  `song_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_userlibrary_user_id_song_id_b2a59968_uniq` (`user_id`,`song_id`),
  KEY `users_userlibrary_song_id_3e611bdd_fk_music_song_id` (`song_id`),
  CONSTRAINT `users_userlibrary_song_id_3e611bdd_fk_music_song_id` FOREIGN KEY (`song_id`) REFERENCES `music_song` (`id`),
  CONSTRAINT `users_userlibrary_user_id_32321646_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_userlibrary`
--

LOCK TABLES `users_userlibrary` WRITE;
/*!40000 ALTER TABLE `users_userlibrary` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_userlibrary` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-27 17:01:51
