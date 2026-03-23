import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAddress, validateAddressUpdate } from '../validations/AddressValidator.js';
import { createAddress, getAllAddressesForUser, updateAddress } from '../controller/address.controller.js';
import USER_ROLES from '../enums/userRoles.js';

const router = express.Router();

const user = USER_ROLES.USER;

// http://localhost:5000/api/addresses

router.post('/createAddress', authenticateUser, authorizeRoles(user), validateAddress, createAddress);
router.get('/getAddressesByUserId/:id', authenticateUser, getAllAddressesForUser);
router.patch('/update/:id', authenticateUser, authorizeRoles(user), validateAddressUpdate, updateAddress);

export default router;