// src/controllers/interviewController.ts
import QuestionData from "../../Database/Questions/leetcode-solutions.json";
import {
  generateResponse,
} from "../../services/aiService";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { connectRedis } from "../../Database/redisDb";
dotenv.config();

const INTERVIEW_JWT_SECRET = process.env.INTERVIEW_JWT_SECRET || "";

export interface IQuestion {
  id: string;
  content: string;
  title: string;
  difficulty?: string;
  name?: any;
  slug?: any;
}



interface IInterview {
  questionId: string;
  language: string;
  userCurrentApproach: string;
  userCode: string;
  user: any;
  conversation: any;
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
    const {
      userCurrentApproach,
      questionId,
      userCode,
      language,
      user,
      conversation,
    } = data as IInterview;

    if (!user || !user._id || !questionId) {
      socket.emit(
        "error",
        "Failed to generate question context, User or Question Id not Provided, Try after Login. :(",
        {
          loading: false,
        }
      );
      return;
    }

    const redisKey = `${user._id}InterviewToken${questionId}`;

    const token: any = await connectRedis.get(redisKey);
    let parsedToken: any;
    if (!token) {
      socket.emit(
        "error",
        "No active interview session found for this question. Please restart the interview process. :(",
        {
          loading: false,
        }
      );
      return;
    } else {
      parsedToken = JSON.parse(token);
    }

    jwt.verify(
      parsedToken?.token,
      INTERVIEW_JWT_SECRET,
      (err: any, decoded: any) => {
        if (err || decoded.id !== questionId) {
          socket.emit(
            "error",
            "Invalid or expired token for this question. Please restart the interview process. :(",
            {
              loading: false,
            }
          );
          return;
        }
      }
    );

    const questionData = (QuestionData as IQuestion[]).find(
      (question) => question.id === questionId
    );

    const userCodeandLanguage = `${userCode} is in language ${language}`;
    if (!questionData) {
      return;
    }

    await generateResponse(
      userCurrentApproach,
      userCodeandLanguage,
      parsedToken?.assistantId,
      parsedToken?.threadId,
      socket
    );


  } catch (error) {
    console.error("Error handling interview:", error);
  }
};
