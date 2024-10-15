# Voice-to-Text Transcription and Chatbot
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


This project is a **Siri clone** web application that allows users to record audio, transcribe it into text using Azure OpenAI's Whisper model, receive a chatbot's response based on the transcribed 
text, and then playback that transcription in a customized voice from ElevenLabs. The chatbot's personality is designed to be humorous, sarcastic, and inspired by mafia movie characters, making the conversation engaging and entertaining.

## Demo Video ⬇️

[![Watch the demo video](https://img.youtube.com/vi/Dvllxk4jTs0/0.jpg)](https://www.youtube.com/embed/Dvllxk4jTs0)


## Features

- **Audio Recording**: Users can record audio through their browser and submit it for transcription.
- **Transcription**: The recorded audio is sent to Azure OpenAI's Whisper model for transcription, converting the audio into text.
- **Chatbot Interaction**: Once transcribed, the text is sent to an Azure OpenAI GPT-based chatbot that responds with a humorous, sarcastic reply based on the given prompt.
- **Real-Time Feedback**: The application displays transcribed text and the chatbot's response in real time.
- **Voice Synthesizer**: The chatbot's response is then sent to ElevenLabs and read aloud using a customized voice.
- **Error Handling**: The application provides feedback if any issues arise, such as missing API keys or an audio file not being provided.

## Technologies Used

- **Next.js**: The React-based framework used for building the frontend and server-side logic.
- **Azure OpenAI**: For both the transcription model (Whisper) and chat completion model (GPT).
- **TypeScript**: Provides type safety and improved development experience.
- **Lucide React**: Icon library used for the UI elements.
- **HTML5 Audio API**: To capture and manipulate audio from the user's microphone.
- **ElevenLabs**: To train my own voice and use as the response voice in the app.

## Components Overview

### Home Component
- Handles the user interface for audio recording and submitting.
- Manages the display of messages and bot responses.
- Uses `useFormState` to handle the form submission and state updates.

### Recorder Component
- Manages the recording process, including microphone access and permissions.
- Uses the `MediaRecorder` API to record audio and convert it into a `Blob` for submission.

### Messages Component
- Displays a list of transcribed messages and the chatbot’s responses.
- Dynamically adjusts its UI based on whether there are messages or if the conversation is starting.

### Transcription Server Function
- Handles the server-side logic of submitting the audio file to Azure OpenAI Whisper for transcription.
- Also handles sending the transcribed text to Azure's GPT model for a response.

### Voice Synthesizer Component
- Takes the GPT model's response and sends it to ElevenLabs.
- Fetches audio from ElevenLabs created with customized voice.

## Environment Variables

To run this project, you will need to set the following environment variables in a `.env` file:

```bash
AZURE_API_KEY=your-azure-api-key
AZURE_ENDPOINT=your-azure-endpoint
AZURE_DEPLOYMENT_NAME=your-azure-whisper-deployment-name
AZURE_DEPLOYMENT_COMPLETIONS_NAME=your-azure-chat-gpt-deployment-name
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

