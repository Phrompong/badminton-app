/*
  Warnings:

  - You are about to drop the `player_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_player_id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_session_id_fkey";

-- DropTable
DROP TABLE "player_profiles";

-- DropTable
DROP TABLE "players";

-- CreateTable
CREATE TABLE "player" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
