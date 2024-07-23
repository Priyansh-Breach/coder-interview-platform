import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../Utils/Error Handler/errorHandler";

const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Invalid Server Error";

  /**
   * Wrong MongoDB ID Error
   */
  if (error.name === "CastError") {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  /**
   * Duplicate key Error
   */
  if (error.code === 11000) {
    const message = `Duplicate key : ${Object.keys(error.keyValue)} entered.`;
    error = new ErrorHandler(message, 400);
  }

  /**
   * Wrong JWT Error
   */
  if (error.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid, try again.`;
    error = new ErrorHandler(message, 400);
  }

  /**
   * Jwt Expired Error
   */
  if (error.name === "TokenExpiredError") {
    const message = `JSON Web Token is Expired, try again.`;
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default ErrorMiddleware;