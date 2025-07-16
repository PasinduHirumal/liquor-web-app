import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createCategory, getAllCategories } from '../controller/category.controller.js';
import { validateCategory } from '../validations/CategoryValidator.js';

const router = express.Router();

// http://localhost:5000/api/categories

router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateCategory, createCategory);
router.get('/getAll', getAllCategories);

export default router;