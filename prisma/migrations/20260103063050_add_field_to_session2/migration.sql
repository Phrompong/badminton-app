/*
  Warnings:

  - Added the required column `amount_per_game` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "amount_per_game" DECIMAL(10,2) NOT NULL;
