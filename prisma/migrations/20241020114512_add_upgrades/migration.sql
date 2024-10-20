-- CreateTable
CREATE TABLE "Upgrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseCost" INTEGER NOT NULL,
    "costMultiplier" DOUBLE PRECISION NOT NULL,
    "effect" JSONB NOT NULL,

    CONSTRAINT "Upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUpgrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "upgradeId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upgrade_name_key" ON "Upgrade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserUpgrade_userId_upgradeId_key" ON "UserUpgrade"("userId", "upgradeId");

-- AddForeignKey
ALTER TABLE "UserUpgrade" ADD CONSTRAINT "UserUpgrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpgrade" ADD CONSTRAINT "UserUpgrade_upgradeId_fkey" FOREIGN KEY ("upgradeId") REFERENCES "Upgrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
