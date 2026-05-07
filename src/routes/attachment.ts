import { Router } from "express";
import { Event } from "../entities/Event.js";
import { EventAttachment } from "../entities/EventAttachment.js";
import { validateUserSession } from "../utils.js";
import { eventAttachmentSchema } from "../validation.js";

const router = Router();

router.get("/event/:eventId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    if (!user || !user.id) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const attachments = await EventAttachment.find({
      where: { event: { id: req.params.eventId, createdBy: { id: user.id } } },
    });

    return res.json({
      success: true,
      msg: "Attachments fetched",
      data: attachments,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: error.message, data: null });
  }
});

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const attachments = await EventAttachment.find({
      where: { event: { createdBy: { id: user.id } } },
      relations: ["event"],
    });

    return res.json({
      success: true,
      msg: "Attachments fetched",
      data: attachments,
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
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const attachment = await EventAttachment.findOne({
      where: { id: req.params.id, event: { createdBy: { id: user.id } } },
    });

    if (!attachment)
      return res
        .status(404)
        .json({ success: false, msg: "Not found", data: null });

    return res.json({
      success: true,
      msg: "Attachment found",
      data: attachment,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/", async (req, res) => {
  const validation = eventAttachmentSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const authHeader = req.headers.authorization;
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const event = await Event.findOne({
      where: { id: validation.data.eventId, createdBy: { id: user.id } },
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, msg: "Event not found", data: null });

    const attachment = EventAttachment.create({ ...validation.data, event });
    await attachment.save();

    return res
      .status(201)
      .json({ success: true, msg: "Attachment created", data: attachment });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const validation = eventAttachmentSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const authHeader = req.headers.authorization;
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    const attachment = await EventAttachment.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!attachment || attachment.event.createdBy.id !== user?.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    Object.assign(attachment, validation.data);
    await attachment.save();

    return res.json({
      success: true,
      msg: "Attachment updated",
      data: attachment,
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
    const user = await validateUserSession(authHeader?.split(" ")[1] || "");

    const attachment = await EventAttachment.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!attachment || attachment.event.createdBy.id !== user?.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    await attachment.softRemove();
    return res.json({ success: true, msg: "Attachment deleted", data: null });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

export default router;
