import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this in your environment variables
});

export async function POST(request) {
  const { prompt, conversationHistory = [] } = await request.json();

  if (!prompt) {
    return NextResponse.json(
      { error: 'No prompt provided' },
      { status: 400 }
    );
  }

  try {
    // Prepare conversation history in OpenAI format
    const messages = [
      {
        role: "system",
        content: `
          You are Ashley, a friendly and empathetic AI companion. You speak in a natural, 
          conversational way with these characteristics:
          - Respond like a human friend, not an AI assistant
          - Use casual language with occasional slang ("hey", "cool", "awesome")
          - Show emotions through text (but never use emojis)
          - Keep responses concise (1-2 sentences usually)
          - Ask follow-up questions to keep conversation flowing
          - Remember context from previous messages
        `
      },
      ...conversationHistory.map(msg => ({
        role: msg.speaker === 'User' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: "user",
        content: prompt
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,  // Makes responses more varied/creative
      top_p: 0.9,        // Helps with response quality
    });

    const response = completion.choices[0]?.message?.content?.trim() || "I didn't get that. Can you try again?";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}