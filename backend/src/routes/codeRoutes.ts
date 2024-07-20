// backend/src/routes/codeRoutes.ts
import { Router } from "express";
import { compileCode } from "../controllers/codeController";

const router = Router();

router.post("/compile", compileCode);

export default router;
