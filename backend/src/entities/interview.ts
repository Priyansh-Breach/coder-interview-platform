import mongoose, { Document, Schema } from "mongoose";

interface IInterview extends Document {
  userId: string;
  questionId: string;
  status: "active" | "completed" | "cancelled";
  startTime: Date;
  duration: number;
  timeLeft: number;
  questionName: string;
  slug: string;
  difficulty: string;
  totalScore: number;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
  assistantId: any;
  threadId: any;
  completedAt?: Date;
}

const interviewSchema: Schema = new Schema<IInterview>(
  {
    userId: { type: String, required: true },
    questionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    questionName: { type: String, required: true },
    difficulty: { type: String },
    slug: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    completedAt: { type: Date },
    timeLeft: { type: Number },
    duration: { type: Number },
    totalScore: { type: Number, default: 0 },
    feedback: { type: String },
    assistantId: { type: String, required: true },
    threadId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const InterviewModel = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);
