import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateOrder, validateOrderAssignedDriverUpdate, validateOrderStatusUpdate } from '../validations/OrdersValidator.js';
import { assignDriverForOrderById, getAllOrders, getOrderById, updateOrderStatusById } from '../controller/orders.controller.js';
import USER_ROLES from '../enums/userRoles.js';
import { createOrder } from '../controller/order.controller.js';

const router = express.Router();

const user = USER_ROLES.USER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/orders

router.get('/getAllOrders', authenticateUser, authorizeRoles(admin, super_admin), getAllOrders);
router.get('/getOrderById/:id', authenticateUser, authorizeRoles(admin, super_admin), getOrderById);
router.patch('/update-status/:id', authenticateUser, authorizeRoles(admin, super_admin), validateOrderStatusUpdate, updateOrderStatusById);
router.patch('/update-assigned_driver/:id', authenticateUser, authorizeRoles(admin, super_admin), validateOrderAssignedDriverUpdate, assignDriverForOrderById);

// user part
router.post('/create', authenticateUser, authorizeRoles(user), validateOrder, createOrder);
export default router;