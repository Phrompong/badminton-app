-- AlterTable
ALTER TABLE "player" ADD COLUMN     "is_online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false;
