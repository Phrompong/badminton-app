"use server";

import { prisma } from "@/lib/prisma";
import { CreateSessionInput, ResponseSession } from "./models/session.model";

const SYSTEM_USER_ID =
  process.env.SYSTEM_USER_ID ?? "00000000-0000-0000-0000-000000000000";

export async function createSession(params: CreateSessionInput) {
  try {
    const actorId = params.createdBy ?? SYSTEM_USER_ID;
    const startAt = new Date(params.startAt);

    const session = await prisma.$transaction(async (tx) => {
      const createdSession = await tx.session.create({
        data: {
          name: params.name,
          startAt,
          location: params.location,
          playerCount: params.playerCount ?? 0,
          courtCount: params.courtNames.length,
          roomCode: params.roomCode,
          amountPerGame: params.amountPerGame,
          createdBy: actorId,
          updatedBy: actorId,
        },
      });

      let countNo = 0;
      for (const item of params.courtNames) {
        countNo += 1;
        await tx.court.create({
          data: {
            no: countNo,
            sessionId: createdSession.id,
            name: item.courtName,
            createdBy: actorId,
            updatedBy: actorId,
          },
        });
      }

      return createdSession;
    });

    return { id: session.id, roomCode: session.roomCode };
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

export async function getSessionByRoomCode(
  roomCode: string,
): Promise<ResponseSession | null> {
  try {
    if (!roomCode) return null;

    const session = await prisma.session.findFirst({
      where: {
        roomCode,
        isActive: true,
      },
    });

    if (!session) {
      return null;
    }

    return {
      ...session,
      amountPerGame: Number(session.amountPerGame) ?? 0,
    };
  } catch (error) {
    console.error("Error getting session by room code:", error);
    throw error;
  }
}

export async function patchSession(params: {
  sessionId: string;
  courtCount: number;
  amountPerGame: number;
}) {
  try {
    const actorId = "00000000-0000-0000-0000-000000000000";

    const result = await prisma.session.update({
      where: { id: params.sessionId },
      data: {
        courtCount: params.courtCount,
        amountPerGame: params.amountPerGame,
        updatedDate: new Date(),
      },
    });

    return { id: result.id };
  } catch (error) {
    console.error("Error patch session:", error);
    throw error;
  }
}

export async function updateIsRandomSession(roomCode: string) {
  try {
    const session = await prisma.session.findFirst({
      where: {
        roomCode,
      },
    });

    if (!session) return;

    const actorId = "00000000-0000-0000-0000-000000000000";

    const result = await prisma.session.update({
      where: { id: session.id },
      data: {
        isRandom: true,
        updatedDate: new Date(),
        updatedBy: actorId,
      },
    });

    return { id: result.id };
  } catch (error) {
    console.error("Error update isRandom session:", error);
    throw error;
  }
}
