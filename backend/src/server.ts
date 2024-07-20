import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./database";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) =>
    console.error("Error during Data Source initialization", err)
  );

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

export default app;
