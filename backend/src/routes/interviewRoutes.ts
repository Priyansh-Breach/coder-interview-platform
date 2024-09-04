import { Router } from "express";
import {
  getQuestionData,
  handleCreateInterviewMongo,
  handleLeaveInterviewMongo,
  handleGetActiveInterview,
} from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";
import {
  deleteInterviewTokenMiddleware,
  generateInterviewTokenMiddleware,
  validateInterviewTokenMiddleware,
} from "../middleware/interviewMiddleware";

const router = Router();

router.post(
  "/start-Interview/:id",
  isUserAuthenticated,
  generateInterviewTokenMiddleware,
  handleCreateInterviewMongo
);

router.post(
  "/leave-Interview/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  deleteInterviewTokenMiddleware,
  handleLeaveInterviewMongo
);

router.get(
  "/getQuestion/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  getQuestionData
);

router.get(
  "/getActiveInterview",
  isUserAuthenticated,
  handleGetActiveInterview
);

{
  /**These route are Socket Routes now and are in Interview Socket Routes file */
}
// router.post(
//   "/test-airesponse/:id",
//   isUserAuthenticated,
//   validateInterviewTokenMiddleware,
//   handleAiConversationResponse
// );

// router.post(
//   "/question-context/:id",
//   isUserAuthenticated,
//   validateInterviewTokenMiddleware,
//   handleAiQuestionContext
// );

export default router;
