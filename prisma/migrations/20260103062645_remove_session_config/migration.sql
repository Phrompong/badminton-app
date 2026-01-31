/*
  Warnings:

  - You are about to drop the `session_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "session_config" DROP CONSTRAINT "session_config_session_id_fkey";

-- DropTable
DROP TABLE "session_config";
