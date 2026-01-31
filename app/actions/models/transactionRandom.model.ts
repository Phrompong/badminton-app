import type { Player } from "@prisma/client";

export interface ResponsePlayerCountInSession {
  playerInformation: Player | null;
  countTransaction: number;
}
