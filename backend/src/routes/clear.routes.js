import express from 'express';
import USER_ROLES from '../enums/userRoles.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import * as clearController from '../controller/clear.controller.js';

const router = express.Router();

const user = USER_ROLES.USER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/clear

router.delete('/cart/my', authenticateUser, authorizeRoles(user), clearController.clearCart);
router.delete('/addresses/my', authenticateUser, authorizeRoles(user), clearController.clearAddresses);

router.delete('/orders', authenticateUser, authorizeRoles(super_admin), clearController.clearOrders);
router.delete('/order-items', authenticateUser, authorizeRoles(super_admin), clearController.clearOrderItems);
router.delete('/money-withdraws', authenticateUser, authorizeRoles(super_admin), clearController.clearMoneyWithdraws);
router.delete('/categories', authenticateUser, authorizeRoles(admin, super_admin), clearController.clearCategories);

export default router;