Create database tables based on Prisma schema
This script will be automatically executed by Prisma Migrate

Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` text,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_name_key` (`name`),
  UNIQUE KEY `users_email_key` (`email`)
);

-- Emojis table
CREATE TABLE IF NOT EXISTS `emojis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unicode` varchar(10) NOT NULL,
  `hashedCode` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `emojis_unicode_key` (`unicode`),
  UNIQUE KEY `emojis_hashedCode_key` (`hashedCode`)
);

-- Messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `emojiCodes` json,
  `fileUrl` text,
  `fileType` varchar(100),
  `fileSize` int,
  `fileName` varchar(255),
  `senderId` int NOT NULL,
  `receiverId` int NOT NULL,
  `replyToMessageId` int,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_senderId_idx` (`senderId`),
  KEY `messages_receiverId_idx` (`receiverId`),
  KEY `messages_replyToMessageId_idx` (`replyToMessageId`),
  CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_replyToMessageId_fkey` FOREIGN KEY (`replyToMessageId`) REFERENCES `messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Reactions table
CREATE TABLE IF NOT EXISTS `reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `userId` int NOT NULL,
  `emojiId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reactions_messageId_userId_emojiId_key` (`messageId`,`userId`,`emojiId`),
  KEY `reactions_messageId_idx` (`messageId`),
  KEY `reactions_userId_idx` (`userId`),
  KEY `reactions_emojiId_idx` (`emojiId`),
  CONSTRAINT `reactions_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reactions_emojiId_fkey` FOREIGN KEY (`emojiId`) REFERENCES `emojis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);
