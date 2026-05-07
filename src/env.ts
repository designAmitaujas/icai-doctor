import { parseEnv } from "znv";
import { z } from "zod";

export const { PORT, DB_NAME, DB_PASS, DB_USER, JWT_SECRET } = parseEnv(
  process.env,
  {
    PORT: z.number().min(1).max(65535).default(3000),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string().min(10),
  },
);
