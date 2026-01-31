/*
  Warnings:

  - Added the required column `level` to the `player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player" ADD COLUMN     "level" VARCHAR(255) NOT NULL;
