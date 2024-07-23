// src/routes/userRoutes.ts
import { Router } from "express";
import { userActivation, userRegistration } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", userRegistration);
router.post("/user-activation", userActivation);
// router.post("/login", loginUser);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

export default router;
