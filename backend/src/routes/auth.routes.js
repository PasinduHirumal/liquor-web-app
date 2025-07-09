import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkAuth, login, logout, register } from '../controller/authAdminUser.controller.js';
import { validateAdminUser } from '../validations/AdminUserValidator.js';

const router = express.Router();

// http://localhost:5000/api/auth


router.post('/register', validateAdminUser, register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.get('/checkAuth', authenticateUser, checkAuth);


export default router;