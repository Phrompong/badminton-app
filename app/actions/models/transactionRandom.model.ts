import type { Player } from "@/lib/prisma/client";

export interface ResponsePlayerCountInSession {
  playerInformation: Player | null;
  countTransaction: number;
}
