import { Router } from "express";
import { Event } from "../entities/Event.js";
import { Video } from "../entities/Video.js";
import { validateUserSession } from "../utils.js";
import { videoCreateSchema, videoUpdateSchema } from "../validation.js";

const router = Router();

router.get("/event/:eventId", async (req, res) => {
  try {
    const user = await validateUserSession(
      req.headers.authorization?.split(" ")[1] || "",
    );
    if (!user || !user.id)
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized", data: null });

    const videos = await Video.find({
      where: { event: { id: req.params.eventId } },
    });

    return res.json({ success: true, msg: "Videos fetched", data: videos });
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

    const videos = await Video.find({
      where: { event: { createdBy: { id: user.id } } },
      relations: ["event"],
    });

    return res.json({
      success: true,
      msg: "Videos fetched successfully",
      data: videos,
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

    const video = await Video.findOne({
      where: { id: req.params.id, event: { createdBy: { id: user.id } } },
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, msg: "Video not found", data: null });
    }

    return res.json({ success: true, msg: "Video found", data: video });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/", async (req, res) => {
  const validation = videoCreateSchema.safeParse(req.body);
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

    const videoEntities = validation.data.filenames.map((name: string) =>
      Video.create({ videoPath: name, event: event }),
    );

    await Video.save(videoEntities);
    return res
      .status(201)
      .json({ success: true, msg: "Videos created", data: videoEntities });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const validation = videoUpdateSchema.safeParse(req.body);
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

    const video = await Video.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!video || video.event.createdBy.id !== user?.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    video.videoPath = validation.data.videoPath;
    await video.save();

    return res.json({ success: true, msg: "Video updated", data: video });
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

    const video = await Video.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!video || video.event.createdBy.id !== user?.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden", data: null });
    }

    await video.softRemove();
    return res.json({ success: true, msg: "Video deleted", data: null });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, msg: "Server error", data: error.message });
  }
});

export default router;
