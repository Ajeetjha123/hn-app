import Story from "../models/Story.js";
import User from "../models/User.js";

export const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStories: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stories." });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }
    res.json({ story });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid story ID." });
    }
    res.status(500).json({ message: "Failed to fetch story." });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(id);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.toString() !== id);
    } else {
      user.bookmarks.push(id);
    }

    await user.save();

    res.json({
      message: isBookmarked ? "Bookmark removed." : "Story bookmarked.",
      bookmarked: !isBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid story ID." });
    }
    res.status(500).json({ message: "Failed to toggle bookmark." });
  }
};
