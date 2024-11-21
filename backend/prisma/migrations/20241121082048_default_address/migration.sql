/*
  Warnings:

  - You are about to drop the column `firstname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `default` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `firstname`,
    DROP COLUMN `lastname`,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL;
