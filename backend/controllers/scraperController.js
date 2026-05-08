import axios from "axios";
import * as cheerio from "cheerio";
import Story from "../models/Story.js";

export const runScraper = async () => {
  const response = await axios.get("https://news.ycombinator.com/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; HN-Scraper/1.0)",
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);
  const stories = [];

  $("tr.athing").each((i, el) => {
    if (i >= 10) return false; // Only top 10

    const titleRow = $(el);
    const subtextRow = titleRow.next("tr");

    const hnId = titleRow.attr("id");
    const rank = parseInt(titleRow.find(".rank").text().replace(".", ""), 10) || i + 1;

    const titleAnchor = titleRow.find(".titleline > a").first();
    const title = titleAnchor.text().trim();
    const rawUrl = titleAnchor.attr("href") || "";
    const url = rawUrl.startsWith("item?id=")
      ? `https://news.ycombinator.com/${rawUrl}`
      : rawUrl;

    const subtext = subtextRow.find(".subtext");
    const pointsText = subtext.find(".score").text();
    const points = parseInt(pointsText.replace(" points", "").replace(" point", ""), 10) || 0;
    const author = subtext.find(".hnuser").text().trim() || "unknown";
    const postedAt = subtext.find(".age").attr("title") || subtext.find(".age a").text().trim() || "";

    const commentsLink = subtext.find("a").filter((_, a) => $(a).text().includes("comment"));
    const commentsCount = parseInt(commentsLink.text().replace(/\D/g, ""), 10) || 0;

    if (title) {
      stories.push({ title, url, points, author, postedAt, hnId, commentsCount, rank });
    }
  });

  const ops = stories.map((story) => ({
    updateOne: {
      filter: { hnId: story.hnId },
      update: { $set: story },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Story.bulkWrite(ops);
  }

  return stories;
};

export const triggerScraper = async (req, res) => {
  try {
    const stories = await runScraper();
    res.json({
      message: `Successfully scraped ${stories.length} stories from Hacker News.`,
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("Scraper error:", error.message);
    res.status(500).json({ message: "Scraper failed. Please try again later.", error: error.message });
  }
};
