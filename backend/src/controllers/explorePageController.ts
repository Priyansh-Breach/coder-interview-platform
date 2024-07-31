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
      const { search, page = "1", limit = "50" } = req.query as ParsedQs;
      console.log(search, page);

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = pageNum * limitNum;

      let filteredResults: IQuestion[] = [];

      if (typeof search === "string" && search.trim() !== "") {
        const searchTerm = search.toLowerCase();
        filteredResults = (QuestionData as IQuestion[]).filter(
          (question) =>
            question.content.toLowerCase().includes(searchTerm) ||
            question.title.toLowerCase().includes(searchTerm)
        );
      } else {
        filteredResults = QuestionData as IQuestion[];
      }

      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      res.status(200).json({
        results: paginatedResults,
        currentPage: pageNum,
        totalPages: Math.ceil(filteredResults.length / limitNum),
        totalResults: filteredResults.length,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
