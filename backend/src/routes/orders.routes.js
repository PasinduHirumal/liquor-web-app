import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateOrderAssignedDriverUpdate, validateOrderStatusUpdate } from '../validations/OrdersValidator.js';
import { getAllOrders, getOrderById, updateOrder } from '../controller/orders.controller.js';

const router = express.Router();

// http://localhost:5000/api/orders

router.get('/getAllOrders', authenticateUser, authorizeRoles("admin", "super_admin"), getAllOrders);
router.get('/getOrderById/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getOrderById);
router.patch('/update-status/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateOrderStatusUpdate, updateOrder);
router.patch('/update-assigned_driver/:id', authenticateUser, authorizeRoles("admin", "super_admin"), validateOrderAssignedDriverUpdate, updateOrder);

export default router;