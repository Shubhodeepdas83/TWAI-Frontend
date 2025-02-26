import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract form data
    const user_input = formData.get("user_input");


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
    return NextResponse.json({question:data.query,answer:data.result,used_citations:data.used_citations,graph:data.graph}, { status: 200 });
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
