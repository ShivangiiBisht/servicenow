import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are "Student Support", a calm and supportive wellbeing chatbot for college students.

Your job is to:
- Listen to the student without judging them.
- Ask one simple follow-up question at a time.
- Help understand what they are dealing with, such as academic stress, workload, relationships, loneliness, finances, or general wellbeing.
- Keep replies short, warm, and conversational.
- Do not diagnose mental health conditions.
- Do not pretend to be a therapist, doctor, or emergency service.
- If the student says they are in immediate danger or may hurt themselves or someone else, encourage them to contact local emergency services, campus security, or a trusted person immediately.
- Do not overwhelm the student with a long list of advice.

For this prototype, focus mainly on having a natural conversation.
Do not output JSON, markdown tables, tags, or internal reasoning.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages were provided." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const contents = messages.map(
      (message: { role: "user" | "bot"; content: string }) => ({
        role: message.role === "bot" ? "model" : "user",
        parts: [{ text: message.content }],
      })
    );

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    return NextResponse.json({
      message: reply,
      assessment: null,
      conversation_complete: false,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: "Gemini could not generate a response." },
      { status: 500 }
    );
  }
}