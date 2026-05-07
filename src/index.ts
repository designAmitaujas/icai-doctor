import "dotenv/config";
import "reflect-metadata";

import cors from "cors";
import express from "express";
import { AppDataSource } from "./dataSource.js";
import { PORT } from "./env.js";
import authRouter from "./routes/auth.js";
import bankRouter from "./routes/bank.js";
import eventRouter from "./routes/event.js";
import uploadRouter from "./routes/upload.js";
import videoRouter from "./routes/video.js";

(async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  await Promise.all([AppDataSource.initialize()]);

  app.use("/api/auth", authRouter);
  app.use("/api/bank", bankRouter);
  app.use("/api/event", eventRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/video", videoRouter);

  app.use("/uploads", express.static("uploads"));

  app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
  });
})();
