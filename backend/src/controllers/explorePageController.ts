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
  difficulty?: string;
}

/**
 * Search function
 */
export const SearchQuestion = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = "1", limit = "50" } = req.query as ParsedQs;

      if (typeof search === "string") {
        const searchTerm = search.toLowerCase();
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;

       
        const filteredResults = (QuestionData as IQuestion[]).filter(
          (question) =>
            question.content.toLowerCase().includes(searchTerm) ||
            question.title.toLowerCase().includes(searchTerm) ||
            (question.difficulty && question.difficulty.toLowerCase().includes(searchTerm))
        );

        
        const paginatedResults = filteredResults.slice(startIndex, endIndex);

        const mappedResults = paginatedResults.map((question:any) => ({
          id: question?.id,
          title: question?.title,
          difficulty: question?.difficulty,
          content: question?.content,
        }));

        res.status(200).json({
          results: mappedResults,
          currentPage: pageNum,
          totalPages: Math.ceil(filteredResults.length / limitNum),
          totalResults: filteredResults.length,
        });
      } else {
        return next(new ErrorHandler("Invalid query parameter", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

