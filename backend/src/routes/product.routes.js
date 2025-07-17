import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, getAllProducts } from '../controller/products.controller.js';
import { validateProduct } from '../validations/ProductValidator.js';

const router = express.Router();

// http://localhost:5000/api/products


router.get('/getAll', getAllProducts);
router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateProduct, createProduct);

export default router;