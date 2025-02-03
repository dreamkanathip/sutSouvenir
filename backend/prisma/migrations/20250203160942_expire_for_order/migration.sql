/*
  Warnings:

  - Added the required column `expire` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `expire` DATETIME(3) NOT NULL;
