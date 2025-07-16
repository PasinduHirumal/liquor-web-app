import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllCategories } from '../controller/category.controller.js';

const router = express.Router();

// http://localhost:5000/api/categories

router.get('/getAll', authenticateUser, authorizeRoles("admin", "super_admin"), getAllCategories);

export default router;