/*
  Warnings:

  - You are about to drop the column `player_id_1` on the `transaction_random` table. All the data in the column will be lost.
  - You are about to drop the column `player_id_2` on the `transaction_random` table. All the data in the column will be lost.
  - You are about to drop the column `player_id_3` on the `transaction_random` table. All the data in the column will be lost.
  - You are about to drop the column `player_id_4` on the `transaction_random` table. All the data in the column will be lost.
  - Added the required column `player_id_A1` to the `transaction_random` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id_A2` to the `transaction_random` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id_B3` to the `transaction_random` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id_B4` to the `transaction_random` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction_random" DROP CONSTRAINT "transaction_random_player_id_1_fkey";

-- DropForeignKey
ALTER TABLE "transaction_random" DROP CONSTRAINT "transaction_random_player_id_2_fkey";

-- DropForeignKey
ALTER TABLE "transaction_random" DROP CONSTRAINT "transaction_random_player_id_3_fkey";

-- DropForeignKey
ALTER TABLE "transaction_random" DROP CONSTRAINT "transaction_random_player_id_4_fkey";

-- AlterTable
ALTER TABLE "transaction_random" DROP COLUMN "player_id_1",
DROP COLUMN "player_id_2",
DROP COLUMN "player_id_3",
DROP COLUMN "player_id_4",
ADD COLUMN     "player_id_A1" UUID NOT NULL,
ADD COLUMN     "player_id_A2" UUID NOT NULL,
ADD COLUMN     "player_id_B3" UUID NOT NULL,
ADD COLUMN     "player_id_B4" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_A1_fkey" FOREIGN KEY ("player_id_A1") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_A2_fkey" FOREIGN KEY ("player_id_A2") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_B3_fkey" FOREIGN KEY ("player_id_B3") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_B4_fkey" FOREIGN KEY ("player_id_B4") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
