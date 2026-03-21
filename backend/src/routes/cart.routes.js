import express from 'express';
import USER_ROLES from '../enums/userRoles.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { isInCart } from '../controller/cart.controller.js';

const router = express.Router();

const user = USER_ROLES.USER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/cart

router.get('/check/product/:product_id', authenticateUser, authorizeRoles(user), isInCart);

export default router;