// src/routes/userRoutes.ts
import { Router } from "express";
import {
  userActivation,
  userRegistration,
  userLogin,
  userLogout,
  updateAccessToken,
  getUserInformation,
} from "../controllers/userController";
import { isUserAuthenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", userRegistration);
router.post("/user-activation", userActivation);
router.post("/login", userLogin);

/**Protected Routes */
router.get("/logout", isUserAuthenticated, userLogout);
router.get("/refresh-token", isUserAuthenticated, updateAccessToken);
router.get("/get-user", isUserAuthenticated, getUserInformation);
router.get("/protected", isUserAuthenticated, (req, res) => {
  res.json({ message: "This is a protected route" });
});

export default router;
