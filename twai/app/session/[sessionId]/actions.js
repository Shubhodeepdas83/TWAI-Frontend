"use server"

import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
// Make ZOD checks here
export async function isValidSession({ sessionId }) {
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


    const found = await prisma.session.findUnique({
        where: { id: sessionId },
        select: {
            chat: true,
            conversation:true,
            
        },
    });









    return { chat: found.chat,conversation:found.conversation };


}

export async function appendConversation({ sessionId, newMessages }) {
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


    await prisma.session.update({
        where: { id: sessionId },
        data: {
            conversation: [...foundSession.conversation, ...newMessages],
        },
    });

    return { success: foundSession };
}

export async function appendChat({ sessionId, newMessages }) {
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
                    chat: true,
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

    await prisma.session.update({
        where: { id: sessionId },
        data: {
            chat: [...foundSession.chat, ...newMessages],
        },
    });

    return { success: foundSession };
}

// export async function getToken(sessionId, mode) {
//     try{
//         if (mode !== "mic" && mode !== "capture") {
//             return { failure: "Invalid mode" };
//         }
//         const session = await getServerSession(authOptions);
    
//         if (!session) {
//             return { failure: "not authenticated" };
//         }
    
//         const user = await prisma.user.findUnique({
//             where: { email: session.user.email },
//             select: {
//                 sessions: {
//                     select: {
//                         id: true,
//                         conversation: true,
//                         createdAt: true,
//                         summary: true,
//                         micToken: true,
//                         captureToken: true,
//                     },
//                 },
//             },
//         });
    
//         if (!user) {
//             return { failure: "User not found" };
//         }
    
//         const foundSession = user.sessions.find((s) => s.id === sessionId);
    
//         if (!foundSession) {
//             return { failure: "Session not found" };
//         }
    
//         if (mode === "mic") {
//             if (!foundSession.micToken) {
//                 const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
//                     method: "POST",
//                     headers: {
//                         "Authorization": process.env.ASSEMBLYAI_API_KEY,
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         "expires_in": 3600,
//                     }),
//                 });
    
//                 if (!response.ok) {
//                     return { failure: "Failed to get token" };
//                 }
//                 const data = await response.json();
//                 await prisma.session.update({
//                     where: { id: sessionId },
//                     data: { micToken: data.token },
//                 });
//                 return { success: data.token };
//             }
//             else {
//                 return { success: foundSession.micToken }
//             };
//         }
//         if(mode === "capture") {
//             if (!foundSession.captureToken) {
//                 const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
//                     method: "POST",
//                     headers: {
//                         "Authorization": process.env.ASSEMBLYAI_API_KEY,
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         "expires_in": 3600,
//                     }),
//                 });
    
//                 if (!response.ok) {
//                     return { failure: "Failed to get token" };
//                 }
//                 const data = await response.json();
//                 await prisma.session.update({
//                     where: { id: sessionId },
//                     data: { captureToken: data.token },
//                 });
//                 return { success: data.token };
//             }
//             else {
//                 return { success: foundSession.captureToken }
//             };
//         }
//     }
//     catch (error) {
//         console.error("Error getting token: ", error);
//         return { failure: "Error getting token" };
//     }
    


// }








