-- DropIndex
DROP INDEX `Product_categoryId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'USER', 'SUPERADMIN') NOT NULL DEFAULT 'USER';
