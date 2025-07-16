import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, getAllProducts } from '../controller/otherProducts.controller.js';
import { validateOtherProduct } from '../validations/OtherProductValidator.js';

const router = express.Router();

// http://localhost:5000/api/other-products

router.post('/create', authenticateUser, authorizeRoles("admin", "super_admin"), validateOtherProduct, createProduct);
router.get('/getAll', getAllProducts);

export default router;