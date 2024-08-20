import { Router } from "express";
import {
  handleAiResponse,
  getQuestionData,
  handleAiQuestionContext,
} from "../controllers/Socket.io/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";
import {
  generateInterviewTokenMiddleware,
  validateInterviewTokenMiddleware,
} from "../middleware/interviewMiddleware";

const router = Router();

router.post(
  "/start-Interview/:id",
  isUserAuthenticated,
  generateInterviewTokenMiddleware,
  (req, res) => {
    res.json({ token: "Interview Activated" });
  }
);

router.post(
  "/question-context/:id",
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

router.post(
  "/test-airesponse/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  handleAiResponse
);

export default router;
