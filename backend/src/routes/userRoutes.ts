import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

export default router;
