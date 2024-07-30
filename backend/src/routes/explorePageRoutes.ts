import { SearchQuestion } from "../controllers/explorePageController";
import { Router } from "express";

const router = Router();
router.get("/search", SearchQuestion);

export default router;
