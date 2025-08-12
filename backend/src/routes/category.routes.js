import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controller/category.controller.js';
import { validateCategory, validateCategoryUpdate } from '../validations/CategoryValidator.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/categories

router.get('/getAll', getAllCategories);
router.get('/getCategoryById/:id', authenticateUser, authorizeRoles(admin, super_admin), getCategoryById);
router.post('/create', authenticateUser, authorizeRoles(admin, super_admin), validateCategory, createCategory);
router.patch('/update/:id', authenticateUser, authorizeRoles(admin, super_admin), validateCategoryUpdate, updateCategory);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteCategory);

export default router;