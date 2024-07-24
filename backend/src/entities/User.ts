import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();

/**
 * Email validator
 */
const emailRegexPattern: RegExp =
  /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

/**
 * Address interface
 */
interface IAddress {
  country: string | null;
  city: string | null;
  address1: string | null;
  address2: string | null;
  zipCode: number | null;
  addressType: string | null;
}

/**
 * User interface
 */
export interface IUser extends Document {
  _id:string;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: Boolean;
  addresses: IAddress[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

/**
 * User Schema
 */
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email.",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters."],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        country: {
          type: String,
          default: null,
        },
        city: {
          type: String,
          default: null,
        },
        address1: {
          type: String,
          default: null,
        },
        address2: {
          type: String,
          default: null,
        },
        zipCode: {
          type: Number,
          default: null,
        },
        addressType: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Password hashing before saving to DB
 */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Sign Access Token
 */
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

/**
 * Sign Refresh Token
 */
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

/**
 * Password comparison
 */
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel: Model<IUser> = mongoose.model("User", userSchema);