"use server";

import { prisma } from "@/lib/prisma";

export async function createRandomPlayers(params: any[]) {
  try {
    await prisma.transaction_Random.createMany({ data: params });
  } catch (error) {
    console.error("Error creating random player:", error);
    throw error;
  }
}

export async function getTransactionRandom(roomCode: string) {
  const session = await prisma.session.findFirst({
    where: {
      roomCode,
    },
  });

  if (!session) return;

  const transactionRandom = await prisma.transaction_Random.findMany({
    where: {
      sessionId: session.id,
    },
  });

  return transactionRandom;
}

export async function getTransactionRandomByPlayerId(
  roomCode: string,
  playerId: string
) {
  const session = await prisma.session.findFirst({
    where: {
      roomCode,
    },
  });

  if (!session) return;

  const transactionRandom = await prisma.transaction_Random.findMany({
    where: {
      sessionId: session.id,
      OR: [
        {
          playerId_A1: playerId,
        },
        {
          playerId_A2: playerId,
        },
        {
          playerId_B3: playerId,
        },
        {
          playerId_B4: playerId,
        },
      ],
    },
  });

  return transactionRandom;
}
