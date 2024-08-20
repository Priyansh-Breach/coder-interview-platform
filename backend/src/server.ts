import "reflect-metadata";
import express from "express";
import { connectMongoDB } from "./Database/mongoDb";
import { app } from "./app";
import { Server } from "socket.io";
import http from "http";
import { socketRoutes } from "./routes/Socket.io/InterviewRoute";  

const server = http.createServer(app);
export const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());


socketRoutes(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // MongoDB connection function
  connectMongoDB();
});
