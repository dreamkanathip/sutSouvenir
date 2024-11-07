/*
  Warnings:

  - Added the required column `firstName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
