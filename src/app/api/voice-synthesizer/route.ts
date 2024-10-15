"use server";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Extracting the `text` and `voiceId` from the request body (assuming it's JSON formatted)
    const { text, voiceId } = await req.json();
    // Retrieve ElevenLabs API key from environment variables
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key is not configured" }, { status: 500 });
    }

    try {
        // Make a POST request to the ElevenLabs API for text-to-speech conversion
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            // Send the text and voice settings in the request body
            body: JSON.stringify({
                text,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.9,
                },
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch audio: ${response.statusText}` }, { status: response.status });
        }

        // If the request is successful, get the audio data as an ArrayBuffer
        const audioBuffer = await response.arrayBuffer();

        // Return the audio data in the response, setting the content type to 'audio/mpeg'
        return new NextResponse(audioBuffer, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
