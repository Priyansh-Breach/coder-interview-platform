import mongoose, { Document, Schema } from "mongoose";

interface IInterview extends Document {
  userId: string;
  questionId: string;
  status: "active" | "completed" | "cancelled";
  startTime: Date;
  endTime?: Date;
  totalScore: number;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    totalScore: { type: Number, default: 0 },
    feedback: { type: String },
  },
  {
    timestamps: true,
  }
);

export const InterviewModel = mongoose.model<IInterview>(
  "Interview",
  interviewSchema
);
