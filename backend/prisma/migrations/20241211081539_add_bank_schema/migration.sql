/*
  Warnings:

  - You are about to drop the column `amount` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `product` table. All the data in the column will be lost.
  - Added the required column `destBankId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastFourDigits` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originBankId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `amount`,
    ADD COLUMN `destBankId` INTEGER NOT NULL,
    ADD COLUMN `lastFourDigits` VARCHAR(191) NOT NULL,
    ADD COLUMN `originBankId` INTEGER NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;

-- AlterTable
-- ALTER TABLE `product` DROP COLUMN `sold`;

-- CreateTable
CREATE TABLE `DestinationBank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(191) NOT NULL,
    `bankNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OriginBank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_originBankId_fkey` FOREIGN KEY (`originBankId`) REFERENCES `OriginBank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_destBankId_fkey` FOREIGN KEY (`destBankId`) REFERENCES `DestinationBank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
