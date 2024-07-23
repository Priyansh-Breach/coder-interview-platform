import "reflect-metadata";
import express, { Request, Response } from "express";
import { connectMongoDB } from "./Database/mongoDb";
import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // MongoDB connection function
  connectMongoDB();
});

