/*
  Warnings:

  - You are about to alter the column `total_paid` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[email]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_status_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "order_status_id" INTEGER NOT NULL,
ALTER COLUMN "total_paid" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "OrderStatus" (
    "order_status_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("order_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_order_status_id_fkey" FOREIGN KEY ("order_status_id") REFERENCES "OrderStatus"("order_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;
