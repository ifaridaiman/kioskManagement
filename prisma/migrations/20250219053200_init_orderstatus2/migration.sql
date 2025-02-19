/*
  Warnings:

  - A unique constraint covering the columns `[orderID]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_orderID_key" ON "Order"("orderID");
