import express from 'express';
import { resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/verifyAccount.controller.js';

const router = express.Router();

// http://localhost:5000/api/verify

router.post("/sendVerifyOtp", sendVerifyOtp);
router.post("/verifyEmail", verifyEmail);
router.post("/sendResetOtp", sendResetOtp);
router.post("/resetPassword", resetPassword);


export default router;