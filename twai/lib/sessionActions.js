"use server";

//CHANGE: PUT ZOD CHECK HERE
export async function get_AI_Help(conversation, use_web, requestType = 'help') {

  try {
    // Create the payload for the FastAPI POST request
    const payload = {
      raw_conversation: conversation,
      use_web: use_web !== undefined ? use_web : true,
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
    console.error("Gemini API error:", error);
    return {
      question: "Sorry, I couldn't process the response.",
      answer: "Sorry, I couldn't process the response."
    };
  }
}


