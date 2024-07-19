// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & { id: number };

    if (typeof decoded !== "object" || !decoded.id) {
      throw new Error("Invalid token payload");
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
