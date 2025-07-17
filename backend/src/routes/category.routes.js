import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createCategory, getAllCategories, updateCategory } from '../controller/category.controller.js';
import { validateCategory, validateCategoryUpdate } from '../validations/CategoryValidator.js';

const router = express.Router();

// http://localhost:5000/api/categories

router.get('/getAll', getAllCategories);
router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateCategory, createCategory);
router.patch('/update/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateCategoryUpdate, updateCategory);

export default router;