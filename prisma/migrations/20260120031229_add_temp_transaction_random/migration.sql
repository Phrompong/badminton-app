-- CreateTable
CREATE TABLE "temp_transaction_random" (
    "id" UUID NOT NULL,
    "player_id_A1" UUID NOT NULL,
    "player_id_A2" UUID NOT NULL,
    "player_id_B3" UUID NOT NULL,
    "player_id_B4" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "created_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "temp_transaction_random_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "temp_transaction_random" ADD CONSTRAINT "temp_transaction_random_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_transaction_random" ADD CONSTRAINT "temp_transaction_random_player_id_A1_fkey" FOREIGN KEY ("player_id_A1") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_transaction_random" ADD CONSTRAINT "temp_transaction_random_player_id_A2_fkey" FOREIGN KEY ("player_id_A2") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_transaction_random" ADD CONSTRAINT "temp_transaction_random_player_id_B3_fkey" FOREIGN KEY ("player_id_B3") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_transaction_random" ADD CONSTRAINT "temp_transaction_random_player_id_B4_fkey" FOREIGN KEY ("player_id_B4") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
