/*
  Warnings:

  - Added the required column `no` to the `court` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "court" ADD COLUMN     "no" INTEGER NOT NULL;
