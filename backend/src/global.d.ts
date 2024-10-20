import { Request } from "express";
import { IUser } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    HUGGINGFACE_API_KEY: string;
    PORT?: string;
    // Add any other environment variables here
  }
}
