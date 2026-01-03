import { prisma } from "@/lib/prisma";

export async function createSession(params: any) {
  try {
    const actorId = "00000000-0000-0000-0000-000000000000";
    const startAt = new Date(params.startAt);

    // const result = await prisma.sessionConfig.create({
    //   data: {},
    // });

    // return result;
  } catch (error) {
    console.error("Error creating session config:", error);
    throw error;
  }
}
