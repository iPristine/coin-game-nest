/*
  Warnings:

  - You are about to drop the column `endTime` on the `UserBoost` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `UserBoost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserBoost" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3);
