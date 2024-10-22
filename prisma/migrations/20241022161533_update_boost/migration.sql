/*
  Warnings:

  - Added the required column `nameLabel` to the `Boost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Boost" ADD COLUMN     "nameLabel" TEXT NOT NULL;
