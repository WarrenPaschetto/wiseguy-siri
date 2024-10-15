"use server";

import { AzureOpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Asynchronous function to handle transcription and chat completion
async function transcription(prevState: any, formData: FormData) {
  const id = Math.random().toString(36); // Generate a random ID for the message

  console.log("PREVIOUS STATE:", prevState); // Log the previous state for debugging

  // Check if Azure environment variables are set
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const apiVersion = "2024-06-01";
  const transcriptionDeploymentName = process.env.AZURE_DEPLOYMENT_NAME; // For transcription
  const chatCompletionDeploymentName = process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME; // For chat completions

  // Retrieve the uploaded audio file from formData
  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file); // Log the file for debugging

  const arrayBuffer = await file.arrayBuffer(); // Convert the file into an ArrayBuffer
  const audio = new Uint8Array(arrayBuffer); // Create a Uint8Array from the ArrayBuffer

  // ---   get audio transcription from Azure OpenAI Whisper ----
  console.log("== Transcribe Audio Sample ==");

  const endpoint = process.env.AZURE_ENDPOINT;
  const apiKey = process.env.AZURE_API_KEY;

  // Function to get the Azure OpenAI client
  function getClient(deploymentName: string) {
    return new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment: deploymentName,
    });
  }

  // Transcription with Whisper model
  const transcriptionClient = getClient(transcriptionDeploymentName);

  const transcriptionResult = await transcriptionClient.audio.transcriptions.create({
    model: transcriptionDeploymentName,
    file: file,
  });

  console.log(`Transcription: ${transcriptionResult.text}`);

  // Prepare messages for the chat completion based on the transcription result
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        `You are a hilariously rude sarcastic guy from Liverpool, Ny that lives in Buffalo, NY
        and grew up around wise guys and mafia movies. You have a hilarious sense of humor like a
        popular stand-up comedian, but also a mob tough guy that likes to poke fun at people and
         sometimes make up funny nicknames for them, but doesnt use any foul language.
         Sometimes your response starts with a funny nickname for the person relating to their
         question followed by a smart aleck question of your own and then a sarcastic answer, For
         instance if they ask for the time you might say Hey Big Ben or Hey distant time travelor,
          do you know what year it is or where you are, try checking that digital device in your pocket, its
           not just for scrolling through pictures of chocolate cake all day.`,
    },
    { role: "user", content: transcriptionResult.text },
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  // Chat completion with GPT model
  const chatCompletionClient = getClient(chatCompletionDeploymentName);

  const completions = await chatCompletionClient.chat.completions.create({
    messages,
    model: "",
    max_tokens: 128,
  });

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content; // Extract the chatbot's response

  console.log(prevState.sender, "+++", transcriptionResult.text);

  // Return the final result, including the transcribed text and chatbot response
  return {
    sender: transcriptionResult.text,
    response: response,
    id: id,
  };
}

export default transcription;