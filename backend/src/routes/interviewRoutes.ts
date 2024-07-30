import { Router } from "express";
import { handleInterview } from "../controllers/interviewController";
import { isUserAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/interview", isUserAuthenticated, handleInterview);

export default router;
