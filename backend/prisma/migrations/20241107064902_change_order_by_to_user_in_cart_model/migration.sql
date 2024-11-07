/*
  Warnings:

  - You are about to drop the column `orderedById` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `productoncart` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ProductOnCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_orderedById_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `orderedById`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `productoncart` DROP COLUMN `count`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
