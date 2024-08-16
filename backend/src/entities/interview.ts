import mongoose, { Schema, Document } from "mongoose";

interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  questionContext: {
    aiContext: string;
    vector: number[]; 
    updatedAt: Date;
  }[];
  explanations: {
    explanation: string;
    vector: number[]; 
    updatedAt: Date;
  }[];
  code: {
    solution: string;
    vector: number[]; 
    updatedAt: Date;
  }[];
  status: string;
  timeLimit: number;
  timeTaken: number;
  aiRating?: number;
  aiFeedback?: string;
  updateTracker: {
    questionContextUpdates: number;
    explanationUpdates: number;
    codeUpdates: number;
  };
}

const InterviewSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  questionContext: [
    {
      aiContext: { type: String, required: true },
      vector: { type: [Number], required: true }, 
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  explanations: [
    {
      explanation: { type: String, required: true },
      vector: { type: [Number], required: true }, 
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  code: [
    {
      solution: { type: String, required: true },
      vector: { type: [Number], required: true }, 
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ["active", "left in between", "completed"],
    required: true,
    default: "active",
  },
  timeLimit: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  aiRating: { type: Number, min: 1, max: 5 },
  aiFeedback: { type: String },
  updateTracker: {
    questionContextUpdates: { type: Number, default: 0 },
    explanationUpdates: { type: Number, default: 0 },
    codeUpdates: { type: Number, default: 0 },
  },
});

export const Interview = mongoose.model<IInterview>("Interview", InterviewSchema);
