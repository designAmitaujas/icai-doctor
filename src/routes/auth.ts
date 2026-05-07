import { Router } from "express";
import { User } from "../entities/User.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
  validateUserSession,
} from "../utils.js";
import {
  loginSchema,
  registerSchema,
  updateNameSchema,
  updatePasswordSchema,
} from "../validation.js";

const router = Router();

router.post("/register", async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const { name, email, password } = validation.data;

    const existingUser = await User.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = User.create({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      msg: "User created successfully",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const { email, password } = validation.data;

    const user = await User.findOneBy({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
        data: null,
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
        data: null,
      });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.json({
      success: true,
      msg: "Login successful",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

router.post("/update-password", async (req, res) => {
  const validation = updatePasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided",
        data: null,
      });
    }

    const user = await validateUserSession(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized: Invalid token or user not found",
        data: null,
      });
    }

    const { currentPassword, newPassword } = validation.data;

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid current password",
        data: null,
      });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.json({
      success: true,
      msg: "Password updated successfully",
      data: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

router.post("/update-name", async (req, res) => {
  const validation = updateNameSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: "No token", data: null });
    }

    const user = await validateUserSession(token);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const { name } = validation.data;
    user.name = name;
    await user.save();

    return res.json({
      success: true,
      msg: "Name updated successfully",
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided",
        data: null,
      });
    }

    const user = await validateUserSession(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized: Invalid token or user not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      msg: "Profile fetched successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

export default router;
