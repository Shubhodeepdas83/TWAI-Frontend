import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Make sure this path is correct
import { PrismaClient } from '@prisma/client';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

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
      select: { id: true,vectorId:true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }



    

    // Extract form data
    const formData = await req.formData();
    const user_input = formData.get("user_input");
    const sessionId = formData.get("sessionId");
    formData.append("userId", user.id);

    if(!sessionId){
      return NextResponse.json({ error: "Session ID not provided" }, { status: 400 });
    }

    const Session = await prisma.session.findUnique({
      where: { userId: user.id,id:sessionId },
      select: { templateId:true,chat:true },
    });

    if (!Session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    if(Session.templateId){
      const template = await prisma.meetingTemplate.findUnique({
        where: { id: Session.templateId },
        select: { purpose:true,
          goal:true,
          additionalInfo:true,
          duration:true,
          documents:{
            select:{
              fileUrl:true,
              title:true,
              description:true,     
            }
          },

         },
      });
      if(template){
        formData.append("meetingTemplate",JSON.stringify(template))
      }
      else{
        formData.append("meetingTemplate",JSON.stringify({}))
      }
    }
    else{
      formData.append("meetingTemplate",JSON.stringify({}))
    }

    if(Session.chat){
      formData.append("chat_Conversation",JSON.stringify(Session.chat))
    }
    else{
      formData.append("chat_Conversation",JSON.stringify([]))
    }
    if(user.vectorId){
      formData.append("vectorId",user.vectorId)
    }


    


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
    const response = await fetch(`${process.env.BACKEND_URL}/chat_with_jamie`, {
      method: "POST",
      body: formData, // Forwarding the same FormData to FastAPI
    });

    if (!response.body) {
      return NextResponse.json({ error: 'No response body' }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
      async start(controller) {
          const reader = response.body.getReader();
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
          }
          controller.close();
      }
  });

  return new NextResponse(readableStream, {
      headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
      },
  });
    // return NextResponse.json({ question: data.query, answer: data.result, used_citations: data.used_citations, graph: data.graph }, { status: 200 });

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
