import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controller/products.controller.js';
import { validateInventoryUpdate, validateProduct, validateProductUpdate } from '../validations/ProductValidator.js';

const router = express.Router();

// http://localhost:5000/api/products


router.get('/getAll', getAllProducts);
router.get('/getProductById/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getProductById);
router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateProduct, createProduct);
router.patch('/update/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateProductUpdate, updateProduct);
router.patch('/update-quantity/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateInventoryUpdate, updateProduct);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteProduct);

export default router;