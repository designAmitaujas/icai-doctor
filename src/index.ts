import "dotenv/config";
import "reflect-metadata";

import cors from "cors";
import express from "express";
import { AppDataSource } from "./dataSource.js";
import { PORT } from "./env.js";
import authRouter from "./routes/auth.js";

(async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  await Promise.all([AppDataSource.initialize()]);

  app.use("/api/auth", authRouter);

  app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
  });
})();
