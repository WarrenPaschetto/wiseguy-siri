'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm"; // Defining the MIME type for the audio recording format

function Recorder({uploadAudio}: { uploadAudio: (blob: Blob) => void}) {

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // useEffect hook to request microphone permission when the component mounts
  useEffect(() => {
    getMicrophonePermission();
  }, []);

  // Function to request microphone permission and store the audio stream
  const getMicrophonePermission = async() => {
    if ("MediaRecorder" in window) { // Check if the MediaRecorder API is supported in the browser
      try {
        // Request the user's permission to access the microphone
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);  // Store the media stream

      } catch (err: unknown) {
        if (err instanceof Error) {
            alert(err.message);
        } else {
            alert("An unknown error occurred");
        }
      }
    } else {
        alert("The MediaRecorder API is not supported in your browser.");
      }
    };

  // Function to start the audio recording process
  const startRecording = async () => {
    if (stream === null || pending) return;

    setRecordingStatus("recording");

    // Create a new media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = []; // Create an array to store audio chunks

    // Event listener that captures audio data chunks when available
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return (console.log("typeof event.data === undefined"));
      if (event.data.size === 0) return (console.log("event.data.size === 0"));

      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks); // Store the audio chunks in state
  };

  const stopRecording = async () => {
    // If the recorder is null or form submission is pending, prevent stopping
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    // When the recording stops, create a Blob from the collected audio chunks and upload it
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  return (
    <div className="flex items-center justify-center text-white">
      {/* Display a button to request microphone permission if not already granted */}
      {!permission && (
        <button onClick={getMicrophonePermission} className="border-red-600 text-red-800 bg-red-100 p-2 rounded-full border-2">Get Microphone</button>
      )}

      {/* If form submission is pending, display a grayed out animated GIF image indicating active recording is being processed */}
      {pending && (
        <Image
          src="/images/active.gif"
          alt="Recording"
          height={350}
          width={350}
          priority={true}
          unoptimized
          className="assistant grayscale"
       />
      )}

      {/* Display a static PNG image if permission is granted, but recording is inactive */}
      {permission && recordingStatus === "inactive" && !pending && (
        <Image
          src="/images/notactive.png"
          alt="Not Recording"
          height={350}
          width={350}
          onClick={startRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}

      {/* Display the animated GIF image while the recording is active */}
      {recordingStatus === "recording" && (
        <Image
          src="/images/active.gif"
          alt="Recording"
          height={350}
          width={350}
          onClick={stopRecording}
          priority={true}
          unoptimized
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
       />
      )}
    </div>
  )
}
export default Recorder;