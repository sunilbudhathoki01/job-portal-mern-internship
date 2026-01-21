import express from "express";
import { webhooksClerk } from "../controllers/webhookController.js";
const router = express.Router();
router.post("/", webhooksClerk);

export default router;
