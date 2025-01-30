/*
  Warnings:

  - A unique constraint covering the columns `[menuId,orderTypeId,dateStart,dateEnd]` on the table `MenuInventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderTypeId` to the `MenuInventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MenuInventory_menuId_key";

-- AlterTable
ALTER TABLE "MenuInventory" ADD COLUMN     "orderTypeId" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "dateStart" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "dateEnd" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MenuInventory_menuId_orderTypeId_dateStart_dateEnd_key" ON "MenuInventory"("menuId", "orderTypeId", "dateStart", "dateEnd");

-- AddForeignKey
ALTER TABLE "MenuInventory" ADD CONSTRAINT "MenuInventory_orderTypeId_fkey" FOREIGN KEY ("orderTypeId") REFERENCES "OrderType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
