import axios from "axios";
import { Readable } from "stream";
import { IQuestion } from "../controllers/Socket.io/SocketinterviewController";
// streamUtils.ts
import { promises as fs } from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const LLM_API_URL = "";

//This Create the Assistant
export const CreateInterviewier = async (question: IQuestion | undefined) => {
  try {
    const instructionsPath = path.join(
      __dirname,
      "../../../modelfiles/OpenAI.txt"
    );
    const instructions = await fs.readFile(instructionsPath, "utf-8");
    const instructionWithQuestion = `${instructions} ${question?.content?.toString()}`;
    const assistant = await openai.beta.assistants.create({
      name: "Interviewer",
      instructions: instructionWithQuestion,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o-mini",
    });

    return assistant;
  } catch (error: any) {
    return false;
  }
};

//This Create the Conversation Id
export const CreateThread = async (
  assistantId: any,
  UserName: any,
  question: any
) => {
  const thread = await openai.beta.threads.create();
  //This Sends the first response from Interviewer
  const instructionsPath = path.join(
    __dirname,
    "../../../modelfiles/OpenAI.txt"
  );
  const instructions = await fs.readFile(instructionsPath, "utf-8");
  const instructionWithQuestion = `${instructions} ${question?.content?.toString()}`;
  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
    instructions: `${instructionWithQuestion}. Please address the user as ${UserName} and You may start the conversation by giving the question context to the user. `,
  });
  let messageComplete: any;
  if (run.status === "completed") {
    const messages: any = await openai.beta.threads.messages.list(
      run.thread_id
    );
    for (const message of messages.data.reverse()) {
      messageComplete = message.content[0].text.value;
    }
  } else {
    return;
  }

  return { threadId: thread.id, Ai: messageComplete };
};

export const generateQuestionContext = async (
  question: IQuestion | undefined,
  socket: any
) => {
  const prompt = `${question}`;
  const requestBody = {
    model: "phase_1",
    prompt: `{ "question": ${prompt}}`,
  };

  try {
    const response = await axios.post(LLM_API_URL, requestBody, {
      responseType: "stream", // Set the response type to stream
    });
    // handleStream(
    //   response.data as unknown as Readable,
    //   (chunk) => {
    //     socket.emit("responseStream", chunk.toString(), { loading: false });
    //   },
    //   () => {
    //     socket.emit("responseComplete");
    //   }
    // );
  } catch (error) {
    socket.emit("error", "Failed to generate question contextxxx", {
      loading: false,
    });
  }
};

export const generateResponse = async (
  userCurrentApproach: string,
  userCode: any,
  assistantId: any,
  threadId: any,
  socket: any
) => {
  const prompt = JSON.stringify({
    user_current_approach: userCurrentApproach,
    user_code: userCode,
  });

  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt,
    });

    const run = openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: assistantId,
      })
      .on("textCreated", (text) => socket.emit("loading", { loading: false }))
      .on("textDelta", (textDelta: any, snapshot) => {
        socket.emit("responseStream", textDelta.value, { loading: false });
      })
      .on("toolCallCreated", (toolCall) => {
        socket.emit("responseStream", `${toolCall.type}\n\n`, {
          loading: false,
        });
      })
      .on("toolCallDelta", (toolCallDelta: any, snapshot: any) => {
        if (toolCallDelta.type === "code_interpreter") {
          if (toolCallDelta.code_interpreter.input) {
            socket.emit(
              "responseStream",
              toolCallDelta.code_interpreter.input,
              {
                loading: false,
              }
            );
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach((output: any) => {
              if (output.type === "logs") {
                socket.emit("responseStream", `\n${output.logs}\n`, {
                  loading: false,
                });
              }
            });
          }
        }
      });
  } catch (error) {
    socket.emit("error", "Something went wrong between our conversation.", {
      loading: false,
    }); // Emit error message to client
  }
};
