import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateActiveToggle, updateProduct } from '../controller/products.controller.js';
import { validateInventoryUpdate, validatePriceOperation, validateProduct, validateProductActiveToggleUpdate, validateProductUpdate } from '../validations/ProductValidator.js';

const router = express.Router();

// http://localhost:5000/api/products

router.get('/getAll', getAllProducts);
router.get('/getProductById/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getProductById);
router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateProduct, createProduct);
router.patch('/update/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateProductUpdate, updateProduct);
router.patch('/update-price/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validatePriceOperation, updateProduct);
router.patch('/update-quantity/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateInventoryUpdate, updateProduct);
router.patch('/update-activeToggle', authenticateUser, authorizeRoles("super_admin"), validateProductActiveToggleUpdate, updateActiveToggle);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteProduct);

export default router;