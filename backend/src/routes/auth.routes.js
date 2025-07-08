import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateUser } from '../validations/userValidator.js';
import { checkAuth, login, logout, register } from '../controller/auth.controller.js';

const router = express.Router();

// http://localhost:5000/api/auth


router.post('/register', validateUser, register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.get('/checkAuth', authenticateUser, checkAuth);


export default router;