import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Make sure this path is correct
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Step 1: Validate User Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Step 2: Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract form data
    const formData = await req.formData();
    const user_input = formData.get("user_input");
    formData.append("userId", user.id);


    // Validate required fields
    if (!user_input) {
      return NextResponse.json(
        {
          question: "Sorry, I couldn't process the response.",
          answer: "Sorry, I couldn't process the response.",
        },
        { status: 200 }
      );
    }

    // Call the FastAPI backend with the extracted data
    const aiResponse = await fetch(`${process.env.BACKEND_URL}/chat_with_jamie`, {
      method: "POST",
      body: formData, // Forwarding the same FormData to FastAPI
    });

    if (!aiResponse.ok) {
      return NextResponse.json(
        {
          question: "Sorry, I couldn't process the response.",
          answer: "Sorry, I couldn't process the response.",
        },
        { status: 200 }
      );
    }

    const data = await aiResponse.json();
    return NextResponse.json({ question: data.query, answer: data.result, used_citations: data.used_citations, graph: data.graph }, { status: 200 });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        question: "Sorry, I couldn't process the response.",
        answer: "Sorry, I couldn't process the response.",
        error: error.message,
      },
      { status: 200 }
    );
  }
}
