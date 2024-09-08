import { NextFunction, Router, Response, Request } from "express";
import {
  getQuestionData,
  handleLeaveInterviewMongo,
  handleGetInterviewHistory_Interviews,
  handleCompleteInterviewMongo,
  handleGetActiveSessions,
} from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";
import {
  deleteInterviewTokenMiddleware,
  generateInterviewTokenMiddleware,
  validateInterviewTokenMiddleware,
  handleCreateInterviewMongo,
  generateReviewTokenMiddleware,
  validateReviewTokenMiddleware,
} from "../middleware/interviewMiddleware";

const router = Router();

router.post(
  "/start-Interview/:id",
  isUserAuthenticated,
  handleCreateInterviewMongo,
  generateInterviewTokenMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(201).json({
      message: "Interview Activated",
      success: true,
    });
  }
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

router.get("/getActiveSessions", isUserAuthenticated, handleGetActiveSessions);

router.post(
  "/getInterviewHistory",
  isUserAuthenticated,
  handleGetInterviewHistory_Interviews
);

router.post(
  "/complete-interview/:id",
  isUserAuthenticated,
  validateInterviewTokenMiddleware,
  validateReviewTokenMiddleware,
  handleCompleteInterviewMongo,
  generateReviewTokenMiddleware,
  deleteInterviewTokenMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(201).json({
      message: "Interview feedback process started.",
      success: true,
    });
  }
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
