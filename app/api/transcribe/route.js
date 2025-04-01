import { exec } from 'child_process';
import fs from 'fs';
import { NextResponse } from 'next/server';

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
  const outputBase = `${tempDir}/${timestamp}`;

  try {
    // Save uploaded file
    const audioBuffer = await audioFile.arrayBuffer();
    fs.writeFileSync(inputPath, Buffer.from(audioBuffer));

    // Convert to MP3
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${inputPath} ${outputPath}`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Transcribe using Whisper with explicit output directory
    const transcription = await new Promise((resolve, reject) => {
      exec(
        `whisper ${outputPath} --model base --output_format txt --language en --output_dir ${tempDir}`,
        (error, stdout) => {
          if (error) {
            reject(error);
          } else {
            const txtFile = `${outputBase}.txt`;
            if (!fs.existsSync(txtFile)) {
              reject(new Error(`Output file not found: ${txtFile}`));
              return;
            }
            const text = fs.readFileSync(txtFile, 'utf-8');
            resolve(text);
          }
        }
      );
    });

    // Clean up all possible files
    const filesToDelete = [
      inputPath,
      outputPath,
      `${outputBase}.txt`,
      `${outputBase}.json`,
      `${outputBase}.srt`,
      `${outputBase}.vtt`
    ];
    
    filesToDelete.forEach(file => {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (cleanupError) {
        console.error(`Error deleting ${file}:`, cleanupError);
      }
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    // Attempt cleanup even if we failed
    try {
      [inputPath, outputPath, `${outputBase}.*`].forEach(pattern => {
        try {
          const files = fs.readdirSync(tempDir).filter(f => f.includes(timestamp));
          files.forEach(file => {
            fs.unlinkSync(`${tempDir}/${file}`);
          });
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