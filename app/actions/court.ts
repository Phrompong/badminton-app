"use server";

import { prisma } from "@/lib/prisma";

export async function createCourt(param: any) {
  try {
    const actorId = "00000000-0000-0000-0000-000000000000";
    const data = {
      ...param,
      createdBy: actorId,
      updatedBy: actorId,
    };

    await prisma.court.create({ data });
  } catch (error) {
    console.error("Error creating court:", error);
    throw error;
  }
}

export async function getCourtAvailable(roomCode: string) {
  const session = await prisma.session.findFirst({
    where: {
      roomCode,
    },
  });

  if (!session) return;

  const courts = await prisma.court.findMany({
    where: {
      sessionId: session.id,
      isAvailable: true,
    },
  });

  return courts;
}

export async function getCourtAvailableBySessionId(sessionId: string) {
  return await prisma.court.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      no: "asc",
    },
  });
}

export async function removeCourt(courtId: string) {
  return await prisma.court.delete({
    where: { id: courtId },
  });
}

export async function patchNameCourt(courtId: string, courtName: string) {
  return await prisma.court.update({
    where: { id: courtId },
    data: { name: courtName },
  });
}

export async function patchUnavailableCourt(courtId: string) {
  return await prisma.court.update({
    where: { id: courtId },
    data: { isAvailable: false },
  });
}
