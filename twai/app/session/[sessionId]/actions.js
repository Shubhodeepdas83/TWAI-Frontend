"use server"

import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function isValidSession({sessionId}) {
    const session = await getServerSession(authOptions);

  if (!session) {
    return { failure: "not authenticated" };
  }
  
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
        sessions: {
            select: {
            id: true,
            conversation: true,
            createdAt: true,
            summary: true,
            },
        },
        },
    });

    if (!user) {
        return { failure: "User not found" };
    }

    const foundSession = user.sessions.find((s) => s.id === sessionId);

    if (!foundSession) {
        return { failure: "Session not found" };
    }

    return { success: foundSession };


}

export async function appendConversation({ sessionId , newMessages }) {
    const session = await getServerSession(authOptions);

  if (!session) {
    return { failure: "not authenticated" };
  }
  
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
        sessions: {
            select: {
            id: true,
            conversation: true,
            createdAt: true,
            summary: true,
            },
        },
        },
    });

    if (!user) {
        return { failure: "User not found" };
    }

    const foundSession = user.sessions.find((s) => s.id === sessionId);

    if (!foundSession) {
        return { failure: "Session not found" };
    }
    const _ = await prisma.session.update({
        where: { id: sessionId },
        data: {
        conversation: [...foundSession.conversation, ...newMessages],
        },
    });

    return { success: foundSession };
}










