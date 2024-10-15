'use client';

import { useEffect, useState } from 'react';

type State = {
    sender: string;
    response: string | null | undefined;
};

function VoiceSynthesizer({ state }: { state: State }) {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    // Function to call the API route on the server
    async function fetchVoiceFromApi(text: string, voiceId: string): Promise<Blob> {
        const response = await fetch('/api/voice-synthesizer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voiceId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch synthesized voice');
        }

        const audioBlob = await response.blob();
        return audioBlob;
    }

    useEffect(() => {
        if (!state.response) return;

        // Fetch audio from the server-side API route
        fetchVoiceFromApi(state.response, "Fg9eSbPBw1k3MASa1738")
            .then((audioBlob) => {
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioElement = new Audio(audioUrl);
                audioElement.volume = 1;

                setAudio(audioElement);
                audioElement.play();
            })
            .catch((error) => {
                console.error('Error fetching voice:', error);
            });

        // Cleanup function to stop audio when component unmounts or when state changes
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
                setAudio(null);
            }
        };
    }, [state]);

    return (
       <></>
    );
}

export default VoiceSynthesizer;
