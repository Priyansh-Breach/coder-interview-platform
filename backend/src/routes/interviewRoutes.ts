import { Router } from "express";
import {
  handleAiResponse,
  getQuestionData,
} from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.get("/getQuestion/:id", isUserAuthenticated, getQuestionData);

router.post("/interview", isUserAuthenticated, handleAiResponse);

export default router;
