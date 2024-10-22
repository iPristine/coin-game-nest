-- CreateTable
CREATE TABLE "Boost" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_completed',
    "additionalInfo" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Boost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boost" ADD CONSTRAINT "Boost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
