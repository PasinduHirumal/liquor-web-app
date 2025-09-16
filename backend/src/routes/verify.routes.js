import express from 'express';
import { resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/verifyAccount.controller.js';

const router = express.Router();

// http://localhost:5000/api/verify

// verify email
router.post("/sendVerifyOtp", sendVerifyOtp);
router.post("/verifyEmail", verifyEmail);

// reset password
router.post("/sendResetOtp", sendResetOtp);
router.post("/resetPassword", resetPassword);


export default router;