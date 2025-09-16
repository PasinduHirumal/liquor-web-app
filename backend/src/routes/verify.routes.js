import express from 'express';
import { resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/verifyAccount.controller.js';
import { validatePasswordUpdate, validateReqOTPUpdate, validateVerifyEmailUpdate } from '../validations/AdminUserValidator.js';

const router = express.Router();

// http://localhost:5000/api/verify

// verify email
router.post("/sendVerifyOtp", validateReqOTPUpdate, sendVerifyOtp);
router.post("/verifyEmail", validateVerifyEmailUpdate, verifyEmail);

// reset password
router.post("/sendResetOtp", validateReqOTPUpdate, sendResetOtp);
router.post("/resetPassword", validatePasswordUpdate, resetPassword);


export default router;