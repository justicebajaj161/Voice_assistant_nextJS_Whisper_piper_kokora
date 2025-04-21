import { exec } from 'child_process';
import fs from 'fs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure to set this in your environment variables
});

export async function POST(request) {
  const formData = await request.formData();
  const audioFile = formData.get('audio');

  if (!audioFile) {
    return NextResponse.json(
      { error: 'No audio file provided' },
      { status: 400 }
    );
  }

  const tempDir = '/tmp';
  const timestamp = Date.now();
  const inputPath = `${tempDir}/${timestamp}.webm`;
  const outputPath = `${tempDir}/${timestamp}.mp3`;

  try {
    // Save uploaded file
    const audioBuffer = await audioFile.arrayBuffer();
    fs.writeFileSync(inputPath, Buffer.from(audioBuffer));

    // Convert to MP3 (if needed - OpenAI API supports many formats including webm)
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${inputPath} ${outputPath}`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Transcribe using OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: "whisper-1",
      language: 'en'
    });

    // Clean up files
    const filesToDelete = [inputPath, outputPath];
    filesToDelete.forEach(file => {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (cleanupError) {
        console.error(`Error deleting ${file}:`, cleanupError);
      }
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    // Attempt cleanup even if we failed
    try {
      [inputPath, outputPath].forEach(file => {
        try {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {}
      });
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}