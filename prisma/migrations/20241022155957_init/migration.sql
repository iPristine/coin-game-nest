/*
  Warnings:

  - You are about to drop the column `additionalInfo` on the `Boost` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Boost` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Boost` table. All the data in the column will be lost.
  - Added the required column `reward` to the `Boost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Boost" DROP CONSTRAINT "Boost_userId_fkey";

-- AlterTable
ALTER TABLE "Boost" DROP COLUMN "additionalInfo",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "reward" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserBoost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "boostId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),

    CONSTRAINT "UserBoost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBoost_userId_boostId_key" ON "UserBoost"("userId", "boostId");

-- AddForeignKey
ALTER TABLE "UserBoost" ADD CONSTRAINT "UserBoost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoost" ADD CONSTRAINT "UserBoost_boostId_fkey" FOREIGN KEY ("boostId") REFERENCES "Boost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
