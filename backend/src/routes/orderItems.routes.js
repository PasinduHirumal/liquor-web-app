import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllOrderItemsForAnOrder } from '../controller/orderItems.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/orderItems

router.get('/getAll/:id', authenticateUser, authorizeRoles(super_admin), getAllOrderItemsForAnOrder);


export default router;