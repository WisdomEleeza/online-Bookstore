/*
  Warnings:

  - Added the required column `paymentMethod` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL;
