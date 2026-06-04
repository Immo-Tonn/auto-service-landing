-- CreateTable
CREATE TABLE "RepairCard" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL DEFAULT '',
    "ownerFirst" TEXT NOT NULL DEFAULT '',
    "ownerLast" TEXT NOT NULL DEFAULT '',
    "vatPercent" DOUBLE PRECISION NOT NULL DEFAULT 19,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItem" (
    "id" TEXT NOT NULL,
    "repairCardId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartItem" (
    "id" TEXT NOT NULL,
    "repairCardId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepairCard_bookingId_key" ON "RepairCard"("bookingId");

-- AddForeignKey
ALTER TABLE "RepairCard" ADD CONSTRAINT "RepairCard_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkItem" ADD CONSTRAINT "WorkItem_repairCardId_fkey" FOREIGN KEY ("repairCardId") REFERENCES "RepairCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartItem" ADD CONSTRAINT "PartItem_repairCardId_fkey" FOREIGN KEY ("repairCardId") REFERENCES "RepairCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
