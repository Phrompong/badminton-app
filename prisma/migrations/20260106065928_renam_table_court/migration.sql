/*
  Warnings:

  - You are about to drop the `Court` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Court" DROP CONSTRAINT "Court_session_id_fkey";

-- DropTable
DROP TABLE "Court";

-- CreateTable
CREATE TABLE "court" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "court_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "court" ADD CONSTRAINT "court_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
