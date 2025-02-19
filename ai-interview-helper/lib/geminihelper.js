import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDUvMvxfieEc_axoBhI4oOn9LfGQW0jq-8"); // Store key in .env file

export async function getGeminiResponse(conversation) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedConversation = conversation.map((msg) =>
      msg.user ? `User: ${msg.user}` : `Other: ${msg.other}`
    ).join("\n");

    const prompt = `You are a answer giver, from the given conversation analyse it and find the question asked (which will mostly be the latest question asked by "other") and a proper answer to that question (it not be necessary that the answer will be in the conversation, so just give a normal answer) ,Here is a conversation:\n${formattedConversation}\n\n return your response in form QUESTION:[QUESTION] ANSWER:[ANSWER]`;

    const result = await model.generateContent(prompt);
    const response =  result.response;
    const responseText = response.text();

    
    const regex = /QUESTION:\s*(.*?)\s*ANSWER:\s*(.*)/s;
    const match = responseText.match(regex);

    if (match) {
      return {
        question: match[1].trim(),
        answer: match[2].trim(),
      };
    } else {
      return {
        question: "Could NOT find a Question.",
        answer: "No valid question found in the response.",
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't process the response.";
  }
}
