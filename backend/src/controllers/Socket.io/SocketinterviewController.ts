// src/controllers/interviewController.ts
import { transcribeAudio } from "../../services/speechToTextService";
import { synthesizeSpeech } from "../../services/textToSpeechService";
import { NextFunction, Request, Response } from "express";
import QuestionData from "../../Database/Questions/leetcode-solutions.json";
import {
  generateQuestionContext,
  generateResponse,
  simulateStream,
} from "../../services/aiService";
import { Socket } from "socket.io";

export interface IQuestion {
  id: string;
  content: string;
  title: string;
  difficulty?: string;
}

/**
 * Ai Response based on question it gives question context
 */

export const handleAiQuestionContext = async (socket: Socket, data: any) => {
  const { questionId } = data;

  try {
    const questionData: any = (QuestionData as IQuestion[]).find(
      (question: any) => question.id === questionId
    );
    if (!questionData) {
      return;
    }

    // await generateQuestionContext(questionData?.content, socket);

    simulateStream(100, socket);
  } catch (error) {
    console.error("Error during streaming:", error);
    socket.emit("error", "Failed to generate question context", {
      loading: false,
    });
  }
};

interface IInterview {
  questionId: string;
  language: string;
  userCurrentApproach: string;
  userCode: string;
}

interface IConversation {
  user: string;
  ai: string | null;
}

/**
 * Ai Response based on user input
 */
export const handleAiConversationResponse = async (
  socket: Socket,
  data: any
) => {
  try {
    const { userCurrentApproach, questionId, userCode, language } =
      data as IInterview;
    const questionData = (QuestionData as IQuestion[]).find(
      (question) => question.id === questionId
    );
    const conversationLog = "";
    const conversationArray = [] as IConversation[];
    const userCodeandLanguage = `${userCode} is in language ${language}`;
    if (!questionData) {
      return;
    }

    // await generateResponse(
    //   questionData?.content,
    //   conversationLog,
    //   userCurrentApproach,
    //   userCode,
    //   socket
    // );
  
    simulateStream(100, socket);
  } catch (error) {
    console.error("Error handling interview:", error);
  }
};
