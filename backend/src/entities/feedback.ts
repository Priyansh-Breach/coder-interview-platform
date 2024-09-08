import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Feedback interface
 */
export interface IFeedback extends Document {
  userId?: string;
  feedbackText: string;
  rating: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Feedback Schema
 */
const feedbackSchema: Schema<IFeedback> = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: false,
      default: "Anonymous",
    },
    feedbackText: {
      type: String,
      required: [false, "Please enter your feedback."],
    },
    rating: {
      type: String,
      required: [true, "Please provide a rating."],
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating must be at most 5."],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Model for Feedback
 */
export const FeedbackModel: Model<IFeedback> = mongoose.model(
  "Feedback",
  feedbackSchema
);
