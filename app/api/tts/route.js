import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { text } = await request.json();
  
  // Exact paths for your system
  const PIPER_DIR = '/Users/codingninjas/Documents/piper_ai_tts/piper';
  const piperPath = path.join(PIPER_DIR, 'piper');
  const modelPath = path.join(PIPER_DIR, 'en_US-lessac-medium.onnx');
  const outputPath = path.join(PIPER_DIR, 'output.wav');

  try {
    // Clean previous file
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    // Simple direct command
    const command = `echo '${text.replace(/'/g, "'\\''")}' | ` +
                   `ESPEAK_DATA_PATH=$(brew --prefix)/share/espeak-ng-data ` +
                   `"${piperPath}" --model "${modelPath}" --output_file "${outputPath}"`;

    await new Promise((resolve, reject) => {
      exec(command, { 
        cwd: PIPER_DIR,
        shell: true // Let system use default shell
      }, (error) => {
        if (error) {
          console.error('Error:', error);
          reject(new Error('Check if Piper and espeak-ng are properly installed'));
        } else {
          resolve();
        }
      });
    });

    const audioData = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    return new NextResponse(audioData, {
      headers: { 'Content-Type': 'audio/wav' }
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech. Try a shorter message.' },
      { status: 500 }
    );
  }
}