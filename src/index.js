import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();   // 

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

//  Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
  });
}

// Start server + DB
server.listen(PORT, () => {
  console.log("🚀 Server is running on Port:", PORT);
  connectDB();
});
