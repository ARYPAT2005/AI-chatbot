import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword} from "../controllers/auth-controllers.js";
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token',forgotPassword)
export default router;