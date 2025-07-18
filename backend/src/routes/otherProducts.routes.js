import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controller/otherProducts.controller.js';
import { validateOtherProduct, validateOtherProductUpdate, validatePriceOperation, validateQuantityOperation } from '../validations/OtherProductValidator.js';

const router = express.Router();

// http://localhost:5000/api/other-products

router.get('/getAll', getAllProducts);
router.get('/getOtherProductById/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getProductById);
router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateOtherProduct, createProduct);
router.patch('/update/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateOtherProductUpdate, updateProduct);
router.patch('/update-price/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validatePriceOperation, updateProduct);
router.patch('/update-quantity/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateQuantityOperation, updateProduct);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteProduct);

export default router;