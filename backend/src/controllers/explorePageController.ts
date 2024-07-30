import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import { cactchAsyncError } from "../middleware/catchAsyncError";
import QuestionData from "../Database/Questions/leetcode-solutions.json";
import { ParsedQs } from "qs";

// Interface for search function
interface ISearch {
  search: string;
}

interface IQuestion {
  content: string;
  title: string;
}

/**
 * Search function
 */
export const SearchQuestion = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query as ParsedQs;

      if (typeof search === "string") {
        const searchTerm = search.toLowerCase();

        const filteredResults = (QuestionData as IQuestion[]).filter(
          (question) =>
            question.content.toLowerCase().includes(searchTerm) ||
            question.title.toLowerCase().includes(searchTerm)
        );

        res.status(200).json(filteredResults);
      } else {
        return next(new ErrorHandler("Invalid query parameter", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

