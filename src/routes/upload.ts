import { Router } from "express";
import multer from "multer";
import path from "path";
import { validateUserSession } from "../utils.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");
    if (!user)
      return res.status(401).json({ success: false, msg: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    return res.json({
      success: true,
      msg: "File uploaded successfully",
      data: { filename: req.file.filename },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default router;
