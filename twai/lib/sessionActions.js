"use server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
//CHANGE: PUT ZOD CHECK HERE
export async function get_AI_Help(conversation, use_web, requestType = 'help') {

  const session = await getServerSession(authOptions);
  
      if (!session) {
          return { failure: "not authenticated" };
      }
  
      const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
              id: true,
          },
      });
  
      if (!user) {
          return { failure: "User not found" };
      }

  try {
    // Create the payload for the FastAPI POST request
    const payload = {
      raw_conversation: conversation,
      use_web: use_web !== undefined ? use_web : true,
      userId: user.id,
    };


    // Set the endpoint based on the requestType
    let endpoint = '';

    switch (requestType) {
      case 'factcheck':
        endpoint = '/process-ai-factcheck';
        break;
      case 'summary':
        endpoint = '/process-ai-summary';
        break;
      default:
        endpoint = '/process-ai-help';
    }

    // Send the conversation to your FastAPI backend
    const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data)
      return {
        question: "Sorry, I couldn't process the response.",
        answer: "Sorry, I couldn't process the response."
      };
    } else {
      const data = await response.json();
      return {
        question: data.query,
        answer: data.result,
        used_citations: data.used_citations || null, // Include citations if they exist
      };
    }
  } catch (error) {
    console.error("BACKEND API error:", error);
    return {
      question: "Sorry, I couldn't process the response.",
      answer: "Sorry, I couldn't process the response."
    };
  }
}


