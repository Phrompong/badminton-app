import type { Player } from "@/generated/prisma/client";

export interface ResponsePlayerCountInSession {
  playerInformation: Player | null;
  countTransaction: number;
}
