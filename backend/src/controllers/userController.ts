// src/controllers/userController.ts

import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { IUser, UserModel } from "../entities/User";
import ErrorHandler from "../Utils/Error Handler/errorHandler";
import { cactchAsyncError } from "../middleware/catchAsyncError";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../Utils/Send Mail/sendMail";
import { sendToken } from "../Utils/Jwt/jwt";

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