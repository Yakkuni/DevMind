/*
  Warnings:

  - Added the required column `categoria` to the `Patrocinador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patrocinador` ADD COLUMN `categoria` VARCHAR(191) NOT NULL;
