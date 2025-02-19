/*
  Warnings:

  - Changed the type of `status` on the `OrderStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('NEW', 'PROCESSED', 'READY_TO_PICKUP', 'COMPLETED');

-- AlterTable
ALTER TABLE "OrderStatus" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatusEnum" NOT NULL;

-- CreateIndex
CREATE INDEX "OrderStatus_orderId_idx" ON "OrderStatus"("orderId");
