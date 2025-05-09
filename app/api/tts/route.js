import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this in your environment variables
});

export async function POST(request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json(
      { error: 'No text provided' },
      { status: 400 }
    );
  }

  try {
    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // You can change this to "echo", "fable", "onyx", "nova", or "shimmer"
      input: text,
      response_format: "mp3" // Can also use "opus", "aac", "flac", or "wav" if preferred
    });

    // Convert the response to a buffer
    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"'
      }
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech. Try a shorter message.' },
      { status: 500 }
    );
  }
}