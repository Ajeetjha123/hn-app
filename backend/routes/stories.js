import express from "express";
import { getAllStories, getStoryById, toggleBookmark } from "../controllers/storiesController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", protect, toggleBookmark);

export default router;
