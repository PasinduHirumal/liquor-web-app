import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import * as adminAuthController from '../controller/authAdminUser.controller.js';
import * as userAuthController from '../controller/authUser.controller.js';
import { validateAdminUser } from '../validations/AdminUserValidator.js';
import { validateUser } from '../validations/UserValidator.js';

const router = express.Router();

// http://localhost:5000/api/auth

// Admin routes
router.post('/admin/register', validateAdminUser, adminAuthController.register);
router.post('/admin/login', adminAuthController.login);
router.post('/admin/logout', authenticateUser, adminAuthController.logout);
router.get('/admin/checkAuth', authenticateUser, adminAuthController.checkAuth);

// User routes
router.post('/user/register', validateUser, userAuthController.register);
router.post('/user/login', userAuthController.login);
router.post('/user/logout', authenticateUser, userAuthController.logout);
router.get('/user/checkAuth', authenticateUser, userAuthController.checkAuth);


export default router;