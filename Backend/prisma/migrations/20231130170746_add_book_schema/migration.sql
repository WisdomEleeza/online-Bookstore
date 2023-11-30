/*
  Warnings:

  - Made the column `paymentMethod` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shippingAddress` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "paymentMethod" SET NOT NULL,
ALTER COLUMN "shippingAddress" SET NOT NULL;

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "ISBN" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "quantityAvailble" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
