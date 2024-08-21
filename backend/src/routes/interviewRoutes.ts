import { Router } from "express";
import {
  handleAiConversationResponse,
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
    res.json({ message: "Interview Activated" });
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
  handleAiConversationResponse
);

export default router;
