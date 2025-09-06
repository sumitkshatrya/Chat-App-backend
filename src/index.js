import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://chat-app-frontend-omega-sand.vercel.app", // deployed frontend
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

// Start server + DB
server.listen(PORT, () => {
  console.log(" Server is running on Port:", PORT);
  connectDB();
});
