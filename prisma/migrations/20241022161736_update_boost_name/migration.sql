/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Boost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Boost_name_key" ON "Boost"("name");
