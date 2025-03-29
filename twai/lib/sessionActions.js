"use server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function get_AI_Help(conversation, use_web, requestType = "help", useHighlightedText, copiedText, sessionId) {
  const session = await getServerSession(authOptions);
  if (!session) return { failure: "not authenticated" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return { failure: "User not found" };

  const Session = await prisma.session.findUnique({
    where: { userId: user.id, id: sessionId },
    select: { templateId: true },
  });

  if (!Session) return { failure: "Session not found" };

  let template = {};
  if (Session.templateId) {
    template = await prisma.meetingTemplate.findUnique({
      where: { id: Session.templateId },
      select: {
        purpose: true,
        goal: true,
        additionalInfo: true,
        duration: true,
        documents: {
          select: { fileUrl: true, title: true },
        },
      },
    });
  }

  try {
    const payload = {
      raw_conversation: conversation,
      use_web: use_web ?? true,
      userId: user.id,
      useHighlightedText,
      highlightedText: copiedText,
      meetingTemplate: JSON.stringify(template),
    };

    const endpoints = {
      factcheck: "/process-ai-factcheck",
      summary: "/process-ai-summary",
      help: "/process-ai-help",
    };

    const response = await fetch(
      `${process.env.BACKEND_URL}${endpoints[requestType]}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    // Read response as JSON and return a plain object
    const responseData = await response.json();
    return responseData; // ✅ Fix for Next.js error
  } catch (error) {
    console.error("BACKEND API error:", error);
    return { failure: "An error occurred while processing the request." };
  }
}
