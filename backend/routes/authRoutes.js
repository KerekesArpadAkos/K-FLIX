import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { sendEmail } from "../controllers/emailController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post('/send-email', sendEmail);

export default router;
