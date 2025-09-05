import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// router.get("/user", (req, res) => {
//     // Your logic to handle the request goes here
//     res.send("This is the user route.");
// });

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

export default router;