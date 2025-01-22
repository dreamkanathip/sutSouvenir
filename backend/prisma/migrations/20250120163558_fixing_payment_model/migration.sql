/*
  Warnings:

  - You are about to drop the column `addressId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `receipt` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_userId_fkey`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `addressId`,
    DROP COLUMN `receipt`,
    DROP COLUMN `userId`;
