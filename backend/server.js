import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });
