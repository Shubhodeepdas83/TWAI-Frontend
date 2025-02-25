"use server";

//CHANGE : PUT ZOD CHECK HERE
export async function get_AI_Help(conversation) {
  try {

    //CHANGE
    // Create the payload for the FastAPI POST request
    const payload = {
      raw_conversation: conversation,
      use_web: true, // Set this based on your requirement
    };
    //CHANGE
    // Send the conversation to your FastAPI backend
    const response = await fetch('http://127.0.0.1:8000/process-ai-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if(!response.ok) {
      return {
        question: "Sorry, I couldn't process the response.",
        answer: "Sorry, I couldn't process the response.",
      }
    }
    else {
      const data = await response.json();
      return {
        question: data.query,
        answer: data.result,
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't process the response.";
  }
}
