"use server";

import { prisma } from "@/lib/prisma";
import type { ResponsePlayerCountInSession } from "./models/transactionRandom.model";

export async function createTransactionRandom(params: any[]) {
  try {
    return await prisma.transaction_Random.createMany({ data: params });
  } catch (error) {
    console.error("Error creating random player:", error);
    throw error;
  }
}

export async function updateTransactionRandom(id: string, data: any) {
  try {
    await prisma.transaction_Random.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating random player:", error);
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

export async function getTransactionRandomBySessionId(sessionId: string) {
  return await prisma.transaction_Random.findMany({
    select: {
      id: true,
      court: {
        select: { id: true, name: true },
      },
      player1: {
        select: {
          id: true,
          name: true,
        },
      },
      player2: {
        select: {
          id: true,
          name: true,
        },
      },
      player3: {
        select: {
          id: true,
          name: true,
        },
      },
      player4: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      sessionId,
      isTemp: false,
    },
    orderBy: {
      court: {
        no: "asc",
      },
    },
  });
}

export async function getTransactionRandomByPlayerId(
  roomCode: string,
  playerId: string,
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

export async function updateEndGameTransactionRandom(id: string) {
  try {
    await prisma.transaction_Random.update({
      where: { id },
      data: {
        isEndGame: true,
        updatedDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating end game random player:", error);
    throw error;
  }
}

export async function getTransactionByTransactionId(transactionId: string) {
  return await prisma.transaction_Random.findUnique({
    where: {
      id: transactionId,
    },
  });
}

export async function checkPlayerInActiveCourt(courtId: string) {
  return await prisma.transaction_Random.findFirst({
    where: {
      courtId,
      isEndGame: false,
    },
  });
}

export async function getPlayerCountInSession(
  playerId: string,
): Promise<ResponsePlayerCountInSession> {
  const playerInformation = await prisma.player.findFirst({
    where: { id: playerId },
  });

  const countTransaction = await prisma.transaction_Random.count({
    where: {
      sessionId: playerInformation?.sessionId,
      isEndGame: true,
      OR: [
        { playerId_A1: playerId },
        { playerId_A2: playerId },
        { playerId_B3: playerId },
        { playerId_B4: playerId },
      ],
    },
  });

  return {
    playerInformation,
    countTransaction,
  };
}
