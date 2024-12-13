/*
  Warnings:

  - Added the required column `receipt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transferAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `receipt` VARCHAR(191) NOT NULL,
    ADD COLUMN `transferAt` DATETIME(3) NOT NULL;
