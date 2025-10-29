import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./server/routes/authRoutes.js";
import noteRoutes from "./server/routes/noteRoutes.js";
import  verifyToken  from "./server/middleware/authMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB error:", err));
// Routes
app.use("/api/auth", authRoutes);
//app.use("/api/notes", verifyToken, noteRoutes);
app.use("/api/notes", noteRoutes);

