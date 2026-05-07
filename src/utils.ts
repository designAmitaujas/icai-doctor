import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { User } from "./entities/User.js";
import { JWT_SECRET } from "./env.js";

const SALT_ROUNDS = 10;

export const generateRandomId = (bytes: number = 8): string => {
  return randomBytes(bytes).toString("hex");
};

export const hashPassword = (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const validateUserSession = async (
  token: string,
): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    const user = await User.findOneBy({ id: decoded.id });

    if (!user) return null;

    return user;
  } catch (error) {
    return null;
  }
};
