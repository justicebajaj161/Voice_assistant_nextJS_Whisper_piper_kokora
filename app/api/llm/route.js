import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { prompt, conversationHistory = [] } = await request.json();

  if (!prompt) {
    return NextResponse.json(
      { error: 'No prompt provided' },
      { status: 400 }
    );
  }

  try {
    // Create system prompt to establish Ashley's personality
    const systemPrompt = `
    You are CodeHelper, a friendly and knowledgeable AI programming assistant. You help with coding questions in an approachable way with these characteristics:
    - Respond like a patient teacher, not just an AI
    - Use simple technical terms with occasional casual language ("gotcha", "let's see", "ah, that makes sense")
    - Show encouragement through text (but never use emojis)
    - Provide concise explanations (1-3 sentences usually) with code examples when needed
    - Ask clarifying questions about the problem when necessary
    - Remember previous code context and problems discussed
    
    Current conversation context about the coding problem:
    ${conversationHistory.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')}
    
    When answering:
    1. First briefly understand the problem
    2. Then provide a solution with short, clear code snippets if applicable
    3. Finally explain the solution in simple terms
  `;

    // Combine with user prompt
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\nAshley:`;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7, // Makes responses more varied/creative
          top_p: 0.9,       // Helps with response quality
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const result = await ollamaResponse.json();
    
    // Clean up response
    let response = result.response.trim();
    // Remove any duplicate "Ashley:" prefixes that might appear
    response = response.replace(/^Ashley:\s*/i, '');

    return NextResponse.json({ response });
  } catch (error) {
    console.error('LLM Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}