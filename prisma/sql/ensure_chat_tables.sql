-- Add missing chat tables without modifying existing application tables.
CREATE TABLE IF NOT EXISTS `ChatSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `visitorName` VARCHAR(191) NOT NULL DEFAULT 'Pengunjung',
    `visitorEmail` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `unreadAdmin` INTEGER NOT NULL DEFAULT 0,
    `unreadVisitor` INTEGER NOT NULL DEFAULT 0,
    `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChatSession_sessionId_key`(`sessionId`),
    INDEX `ChatSession_status_idx`(`status`),
    INDEX `ChatSession_lastMessageAt_idx`(`lastMessageAt`),
    INDEX `ChatSession_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `ChatMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `senderType` ENUM('VISITOR', 'ADMIN') NOT NULL,
    `senderName` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatMessage_sessionId_idx`(`sessionId`),
    INDEX `ChatMessage_createdAt_idx`(`createdAt`),
    CONSTRAINT `ChatMessage_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ChatSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

