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
      return res.status(401).json({ success: false, msg: "Unauthorized" });

    const videos = await Video.find({
      where: { event: { id: req.params.eventId } },
    });

    return res.json({ success: true, data: videos });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

router.post("/", async (req, res) => {
  const validation = videoCreateSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, data: validation.error.flatten() });
  }

  try {
    const { eventId, filenames } = validation.data;
    const user = await validateUserSession(
      req.headers.authorization?.split(" ")[1] || "",
    );

    if (!user || !user.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const event = await Event.findOne({
      where: { id: eventId, createdBy: { id: user.id } },
    });
    if (!event)
      return res.status(404).json({ success: false, msg: "Event not found" });

    const videoEntities = filenames.map((name: string) =>
      Video.create({
        videoPath: name,
        event: event,
      }),
    );

    await Video.save(videoEntities);

    return res
      .status(201)
      .json({ success: true, msg: "Videos registered", data: videoEntities });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const validation = videoUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, data: validation.error.flatten() });
  }

  try {
    const { videoPath } = validation.data;
    const user = await validateUserSession(
      req.headers.authorization?.split(" ")[1] || "",
    );

    if (!user || !user.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const video = await Video.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!video || video.event.createdBy.id !== user.id) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    video.videoPath = videoPath;
    await video.save();

    return res.json({ success: true, msg: "Video updated", data: video });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await validateUserSession(
      req.headers.authorization?.split(" ")[1] || "",
    );

    if (!user || !user.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const video = await Video.findOne({
      where: { id: req.params.id },
      relations: ["event", "event.createdBy"],
    });

    if (!video || video.event.createdBy.id !== user.id) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    await video.softRemove();
    return res.json({ success: true, msg: "Video soft deleted" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default router;
