/*
  Warnings:

  - Made the column `court_id` on table `transaction_random` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transaction_random" DROP CONSTRAINT "transaction_random_court_id_fkey";

-- AlterTable
ALTER TABLE "transaction_random" ALTER COLUMN "court_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
