import { Router } from "express";
import {
  handleAiResponse,
  getQuestionData,
} from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";
import {
  generateInterviewTokenMiddleware,
  validateInterviewTokenMiddleware,
} from "../middleware/interviewMiddleware";

const router = Router();

router.get(
  "/getQuestion/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  getQuestionData
);

router.post(
  "/interview",
  isUserAuthenticated,
  generateInterviewTokenMiddleware,
  handleAiResponse
);

export default router;
