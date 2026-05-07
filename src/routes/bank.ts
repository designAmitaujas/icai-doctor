import { Router } from "express";
import { BankDetail } from "../entities/BankDetail.js";
import { validateUserSession } from "../utils.js";
import { bankDetailSchema } from "../validation.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const details = await BankDetail.find({
      where: { createdBy: { id: user.id } },
    });

    return res.json({
      success: true,
      msg: "Records fetched",
      data: details,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const detail = await BankDetail.findOne({
      where: { id: req.params.id, createdBy: { id: user.id } },
    });

    if (!detail) {
      return res
        .status(404)
        .json({ success: false, msg: "Record not found", data: null });
    }

    return res.json({
      success: true,
      msg: "Record found",
      data: detail,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/", async (req, res) => {
  const validation = bankDetailSchema.safeParse(req.body);

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
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const bankDetail = BankDetail.create({
      ...validation.data,
      createdBy: user,
      updatedBy: user,
    });

    await bankDetail.save();

    return res.status(201).json({
      success: true,
      msg: "Bank detail created",
      data: bankDetail,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const validation = bankDetailSchema.safeParse(req.body);

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
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const detail = await BankDetail.findOne({
      where: { id: req.params.id },
      relations: ["createdBy"],
    });

    if (!detail) {
      return res
        .status(404)
        .json({ success: false, msg: "Record not found", data: null });
    }

    if (detail.createdBy.id !== user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    Object.assign(detail, validation.data);
    detail.updatedBy = user;
    await detail.save();

    return res.json({
      success: true,
      msg: "Record updated",
      data: detail,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const detail = await BankDetail.findOne({
      where: { id: req.params.id },
      relations: ["createdBy"],
    });

    if (!detail) {
      return res
        .status(404)
        .json({ success: false, msg: "Record not found", data: null });
    }

    if (detail.createdBy.id !== user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    await detail.softRemove();

    return res.json({ success: true, msg: "Record deleted", data: null });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

export default router;
