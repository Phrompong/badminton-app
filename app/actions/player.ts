"use server";

import { prisma } from "@/lib/prisma";

export async function createPlayer(
  params: {
    sessionId: string;
    name: string;
    level: string;
  }[],
) {
  try {
    const actorId = "00000000-0000-0000-0000-000000000000";

    const objs = params.map((param) => ({
      sessionId: param.sessionId,
      name: param.name,
      level: param.level,
      isOnline: false,
      isPaid: false,
      isActive: true,
      createdDate: new Date(),
      updatedDate: new Date(),
      createdBy: actorId,
      updatedBy: actorId,
    }));

    const result = await prisma.player.createMany({
      data: objs,
    });

    return result;
  } catch (error) {
    console.error("Error creating player:", error);
    throw error;
  }
}

export async function getPlayersBySessionId(sessionId: string) {
  return await prisma.player.findMany({
    where: {
      sessionId,
      isActive: true,
    },
    orderBy: [
      {
        createdDate: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function updateOnlineStatus(playerId: string, isOnline: boolean) {
  try {
    return await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        isOnline,
        updatedDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating online status:", error);
    throw error;
  }
}

export async function getAllPlayers(sessionId: string) {
  return await prisma.player.findMany({
    where: {
      sessionId,
      isActive: true,
    },
  });
}

export async function getAllOnlinePlayers(sessionId: string) {
  return await prisma.player.findMany({
    where: {
      sessionId,
      isActive: true,
      isOnline: true,
      isPlaying: false,
    },
  });
}

export async function getAllOnlineAndPlaying(sessionId: string) {
  return await prisma.player.findMany({
    where: {
      sessionId,
      isActive: true,
      isOnline: true,
    },
  });
}

export async function updatePlayStatus(playerId: string, isPlaying: boolean) {
  try {
    return await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        isPlaying,
        playingSince: isPlaying ? new Date() : null,
      },
    });
  } catch (error) {
    console.error("Error updating play status:", error);
    throw error;
  }
}

export async function updateIsPaidStatus(playerId: string, isPaid: boolean) {
  try {
    return await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        isPaid,
        updatedDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating isPaid status:", error);
    throw error;
  }
}

export async function getPlayerById(playerId: string) {
  if (!playerId) {
    return null;
  }
  return await prisma.player.findFirst({
    where: {
      id: playerId,
    },
  });
}

export async function updatePlayerName(playerId: string, name: string) {
  try {
    return await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        name,
        updatedDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating player name:", error);
    throw error;
  }
}

export async function removePlayer(playerId: string) {
  try {
    return await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        isActive: false,
        updatedDate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error removing player:", error);
    throw error;
  }
}
