import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateOrdersStatusUpdate } from '../validations/OrdersValidator.js';
import { getAllOrders } from '../controller/orders.controller.js';

const router = express.Router();

// http://localhost:5000/api/orders

router.get('/getAllOrders', authenticateUser, authorizeRoles("admin", "super_admin"), getAllOrders);

export default router;