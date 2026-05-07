import { Router } from "express";
import moment from "moment";
import { Between } from "typeorm";
import { Event } from "../entities/Event.js";
import { validateUserSession } from "../utils.js";
import { eventSchema, yearParamSchema } from "../validation.js";

const router = Router();

router.get("/year/:year", async (req, res) => {
  const validation = yearParamSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      msg: "Validation failed",
      data: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const { year } = validation.data;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const user = await validateUserSession(token || "");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });
    }

    const startOfYear = moment(`${year}-01-01`)
      .startOf("year")
      .format("YYYY-MM-DD");
    const endOfYear = moment(`${year}-12-31`)
      .endOf("year")
      .format("YYYY-MM-DD");

    const events = await Event.find({
      where: {
        createdBy: { id: user.id },
        eventDate: Between(startOfYear, endOfYear),
      },
    });

    return res.json({
      success: true,
      msg: `Events for year ${year} fetched successfully`,
      data: events,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: error.message,
    });
  }
});

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

    const events = await Event.find({
      where: { createdBy: { id: user.id } },
    });

    return res.json({
      success: true,
      msg: "Events fetched successfully",
      data: events,
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

    const event = await Event.findOne({
      where: { id: req.params.id, createdBy: { id: user.id } },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, msg: "Event not found", data: null });
    }

    return res.json({
      success: true,
      msg: "Event found",
      data: event,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/", async (req, res) => {
  const validation = eventSchema.safeParse(req.body);
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

    const event = Event.create({
      ...validation.data,
      additionalComments: validation.data.additionalComments || "",
      createdBy: user,
      updatedBy: user,
    });

    await event.save();

    return res.status(201).json({
      success: true,
      msg: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const validation = eventSchema.safeParse(req.body);
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

    const event = await Event.findOne({
      where: { id: req.params.id },
      relations: ["createdBy"],
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, msg: "Event not found", data: null });
    }

    if (event.createdBy.id !== user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    Object.assign(event, validation.data);
    event.updatedBy = user;
    await event.save();

    return res.json({
      success: true,
      msg: "Event updated successfully",
      data: event,
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

    const event = await Event.findOne({
      where: { id: req.params.id },
      relations: ["createdBy"],
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, msg: "Event not found", data: null });
    }

    if (event.createdBy.id !== user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    await event.softRemove();

    return res.json({
      success: true,
      msg: "Event deleted successfully",
      data: null,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

export default router;
