import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Response, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";

import ErrorMiddleware from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import codeRoutes from "./routes/codeRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import explorePageRoutes from "./routes/explorePageRoutes";

export const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://10.128.0.5:5173",
      "https://dronacharya.co",
      "http://34.27.45.184:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://10.128.0.5:5173",
      "https://dronacharya.co",
      "http://34.27.45.184:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const upload = multer({ dest: "uploads/" });
app.use(express.json());
app.use(cookieParser());

app.use("/api/interview", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/explore", explorePageRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});
app.use(ErrorMiddleware);

// Initialize Socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // Example of handling a custom event
  socket.on("exampleEvent", (data) => {
    console.log("Received data:", data);
    socket.emit("responseEvent", {
      message: "This is a response from the server",
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
