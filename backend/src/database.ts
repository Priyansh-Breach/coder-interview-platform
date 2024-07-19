// src/database.ts
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "yourusername",
  password: "yourpassword",
  database: "coder_interview_platform",
  entities: [User],
  synchronize: true,
  logging: false,
});
