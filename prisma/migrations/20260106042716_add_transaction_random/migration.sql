-- CreateTable
CREATE TABLE "transaction_random" (
    "id" UUID NOT NULL,
    "player_id_1" UUID NOT NULL,
    "player_id_2" UUID NOT NULL,
    "player_id_3" UUID NOT NULL,
    "player_id_4" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "created_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "transaction_random_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_1_fkey" FOREIGN KEY ("player_id_1") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_2_fkey" FOREIGN KEY ("player_id_2") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_3_fkey" FOREIGN KEY ("player_id_3") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_random" ADD CONSTRAINT "transaction_random_player_id_4_fkey" FOREIGN KEY ("player_id_4") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
