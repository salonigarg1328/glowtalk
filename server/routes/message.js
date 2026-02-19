import express from "express";
import multer from 'multer';
const router = express.Router();
import { sendMessage, getMessages } from "../controllers/messageControllers.js";
import { Auth } from "../middleware/user.js";

// ✅ Multer setup - memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ✅ File support add kiya
router.post("/", Auth, upload.single('file'), sendMessage);
router.get("/:chatId", Auth, getMessages);

export default router;