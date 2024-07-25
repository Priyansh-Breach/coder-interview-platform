// src/controllers/userController.ts

import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IUser, UserModel } from "../entities/User";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import { cactchAsyncError } from "../middleware/catchAsyncError";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../Utils/Send Mail/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../Utils/Jwt/jwt";
import { connectRedis } from "../Database/redisDb";
import { getUserById } from "../services/userService";
import { FeedbackModel, IFeedback } from "../entities/feedback";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * User Registration Interface
 */
interface IResgistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

/**
 * User Registration Function
 */
export const userRegistration = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body;
      const doesEmailExist = await UserModel.findOne({ email });
      if (doesEmailExist) {
        return next(
          new ErrorHandler("User already exists with a similar email.", 400)
        );
      }

      const RegistringUser: IResgistrationBody = {
        name,
        email,
        password,
      };

      const userActivationToken = createUserActivationToken(RegistringUser);
      const userActivationCode = userActivationToken.activationCode;
      const data = {
        RegistringUser: {
          name: RegistringUser.name,
          mailLogo: process.env.EMAIL_LOGO_ONE,
        },
        userActivationCode,
      };
      const html = await ejs.renderFile(
        path.join(
          __dirname,
          "../mails/User Activation/userActivation.mail.ejs"
        ),
        data
      );

      try {
        await sendMail({
          email: RegistringUser.email,
          subject: "Account activation.",
          template: "User Activation/userActivation.mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email ${RegistringUser.name}, to activate your account!`,
          activationToken: userActivationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * User activation-token interface
 */
interface IUserActivationToken {
  token: string;
  activationCode: string;
}
/**
 *  Generating Activation Token for the Registring user
 */
export const createUserActivationToken = (user: any): IUserActivationToken => {
  let num = Math.random() + 1;
  const activationCode = Math.floor(num * 100000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

/**
 * User Activation interface
 */
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
/**
 * User Activation function
 */
export const userActivation = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.JWT_ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code.", 400));
      }

      const { name, email, password } = newUser.user;
      const doesUserExist = await UserModel.findOne({ email });
      if (doesUserExist) {
        return next(
          new ErrorHandler("User already exists with a similar email.", 400)
        );
      }
      const user = await UserModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "Your account is activated.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * User Login Interface
 */
interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * User Login function
 */
export const userLogin = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please fill in all required fields.", 400)
        );
      }

      const user = await UserModel.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new ErrorHandler(
            "User doesn't exist with the email you entered.",
            400
          )
        );
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password.", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * User Logout function
 */
export const userLogout = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      connectRedis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Update AccessToken funciton
 */
export const updateAccessToken = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token";

      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await connectRedis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler("Please log in to continue.", 400));
      }

      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await connectRedis.set(user._id, JSON.stringify(user), "EX", 259200); //3 days
      res.status(200).json({
        succes: true,
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Get User Information function
 */
export const getUserInformation = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user?._id as string;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/**
 * Feedback  Interface
 */
interface IFeedbackinterface {
  userId?: string;
  feedbackText: string;
  rating: number;
}

/**
 * Feedback Function
 */
export const giveFeedback = cactchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { feedbackText, rating, userId } = req.body as IFeedbackinterface;

      if (!feedbackText || !rating) {
        return next(new ErrorHandler("Fill all the fields.", 400));
      }

      const feedback = await FeedbackModel.create({
        feedbackText,
        rating,
        userId: userId || "Anonymous",
      });

      if (!feedback) {
        return next(
          new ErrorHandler("Feedback is not uploaded. Try again!", 400)
        );
      }

      res.status(201).json({
        succes: true,
        message: "Feedback sent. Thank you :)",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
