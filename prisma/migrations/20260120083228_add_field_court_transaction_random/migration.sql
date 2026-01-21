-- AlterTable
ALTER TABLE "transaction_random" ADD COLUMN     "court_id" UUID;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "court"("id") ON DELETE SET NULL ON UPDATE CASCADE;
