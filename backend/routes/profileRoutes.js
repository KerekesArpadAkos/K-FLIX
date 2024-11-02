import { Router } from "express";
import { createProfile } from "../controllers/profileController.js";
import verifyToken from "../config/authMiddleware.js";

const router = Router();

router.post("/profiles", verifyToken, createProfile); // Create Profile
// Add routes for getting, updating, and deleting profiles

export default router;
