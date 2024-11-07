/*
  Warnings:

  - You are about to drop the column `city` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `address` table. All the data in the column will be lost.
  - Added the required column `district` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDistrict` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    ADD COLUMN `district` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `subDistrict` VARCHAR(191) NOT NULL;
