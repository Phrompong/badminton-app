/*
  Warnings:

  - You are about to drop the `temp_transaction_random` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "temp_transaction_random" DROP CONSTRAINT "temp_transaction_random_player_id_A1_fkey";

-- DropForeignKey
ALTER TABLE "temp_transaction_random" DROP CONSTRAINT "temp_transaction_random_player_id_A2_fkey";

-- DropForeignKey
ALTER TABLE "temp_transaction_random" DROP CONSTRAINT "temp_transaction_random_player_id_B3_fkey";

-- DropForeignKey
ALTER TABLE "temp_transaction_random" DROP CONSTRAINT "temp_transaction_random_player_id_B4_fkey";

-- DropForeignKey
ALTER TABLE "temp_transaction_random" DROP CONSTRAINT "temp_transaction_random_session_id_fkey";

-- AlterTable
ALTER TABLE "transaction_random" ADD COLUMN     "is_end_game" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "temp_transaction_random";
