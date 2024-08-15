import { Router } from "express";
import {
  handleAiResponse,
  getQuestionData,
  handleAiQuestionContext,
} from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";
import {
  generateInterviewTokenMiddleware,
  validateInterviewTokenMiddleware,
} from "../middleware/interviewMiddleware";

const router = Router();

router.post(
  "/start-Interview",
  isUserAuthenticated,
  generateInterviewTokenMiddleware,
  (req, res) => {
    res.json({ token: "Interview Activated" });
  }
);

router.post(
  "/question-context",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  handleAiQuestionContext
);

router.get(
  "/getQuestion/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  getQuestionData
);

export default router;
