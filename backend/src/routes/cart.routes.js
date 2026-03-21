import express from 'express';
import USER_ROLES from '../enums/userRoles.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { addToCart, isInCart, removeFromCart } from '../controller/cart.controller.js';

const router = express.Router();

const user = USER_ROLES.USER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/cart

router.get('/check/product/:product_id', authenticateUser, authorizeRoles(user), isInCart);
router.post('/add/product/:product_id', authenticateUser, authorizeRoles(user), addToCart);
router.delete('/remove/:cart_item_id', authenticateUser, authorizeRoles(user), removeFromCart);

export default router;