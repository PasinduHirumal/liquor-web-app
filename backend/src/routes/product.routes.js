import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllProducts } from '../controller/productsController.js';

const router = express.Router();

// http://localhost:5000/api/products

router.get('/getAll', authenticateUser, authorizeRoles("admin", "super_admin"), getAllProducts);

export default router;