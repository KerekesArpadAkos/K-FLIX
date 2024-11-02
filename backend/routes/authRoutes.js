import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login); // Token handling is expected on the frontend

export default router;
