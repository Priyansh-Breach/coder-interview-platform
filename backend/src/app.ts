// src/app.ts (or your main entry file)
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import express from "express";
import multer from "multer";
import { handleInterview } from "./controllers/interviewController";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/interview", upload.single("audio"), handleInterview);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
