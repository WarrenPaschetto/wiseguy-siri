'use client';

import Messages from "@/components/Messages";
import Recorder, { mimeType } from "@/components/Recorder";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import transcription from "../../actions/transcription";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";

// Initial state for the form data
const initialState = {
  sender: "",
  response: "",
  id: "",
};

// Defining the structure of a message
export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useFormState(transcription, initialState);
  const [messages, setMessages] = useState<Message[]>([]);

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    if (state?.sender && state.response && state.id) {
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || ""
        },
        ...messages
      ]);
    }
  }, [state]);

  // Function to handle uploading of audio files
  const uploadAudio = (blob: Blob) => {
    // Create a new File object from the audio Blob
    const file = new File([blob], "audio.webm", { type: mimeType});

    // set the file as the value of the hidden file input field
    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // simulate a click and submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  return (
      <main className="bg-black h-screen overflow-y-auto">
       {/*Header*/}
       <header className="flex w-full justify-center fixed top-0 text-white p-5">
        <h1 className="text-3xl">Wise&nbsp;</h1>
        <Image
          src="/images/warrenCartoon.png"
          alt="Logo"
          height={70}
          width={70}
          className="rounded-full object-contain"
          />
           <h1 className="text-3xl">&nbsp;Guy</h1>
       </header>

       {/*Form*/}
       <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-orange-400 to-black">
          <Messages messages={messages}/>
        </div>
        {/*Hidden Fields*/}
        <input type="file" name="audio" hidden ref={fileRef}></input>
        <button type="submit" hidden ref={submitButtonRef}></button>

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio}/>
          <div>
            <VoiceSynthesizer
              state={state}
            />
          </div>
        </div>
       </form>
      </main>
  );
}
