/*
  Warnings:

  - The `type` column on the `Boost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `UserBoost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BoostType" AS ENUM ('INSTANT', 'DELAYED');

-- CreateEnum
CREATE TYPE "UserBoostStatus" AS ENUM ('AVAILABLE', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Boost" DROP COLUMN "type",
ADD COLUMN     "type" "BoostType" NOT NULL DEFAULT 'INSTANT';

-- AlterTable
ALTER TABLE "UserBoost" DROP COLUMN "status",
ADD COLUMN     "status" "UserBoostStatus" NOT NULL DEFAULT 'AVAILABLE';
