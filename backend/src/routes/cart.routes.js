import express from 'express';
import USER_ROLES from '../enums/userRoles.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { addToCart, changeQuantity, checkoutCart, getMyCart, isInCart, removeFromCart } from '../controller/cart.controller.js';
import { validateCartQuantityUpdate } from '../validations/CartValidator.js';

const router = express.Router();

const user = USER_ROLES.USER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/cart

router.get('/check/is-in-cart/product/:product_id', authenticateUser, authorizeRoles(user), isInCart);

router.get('/my', authenticateUser, authorizeRoles(user), getMyCart);
router.get('/checkout/order/address/:address_id', authenticateUser, authorizeRoles(user), checkoutCart);

router.post('/add/product/:product_id', authenticateUser, authorizeRoles(user), addToCart);
router.patch('/change/quantity/:cart_item_id', validateCartQuantityUpdate, authenticateUser, authorizeRoles(user), changeQuantity);
router.delete('/remove/:cart_item_id', authenticateUser, authorizeRoles(user), removeFromCart);

export default router;