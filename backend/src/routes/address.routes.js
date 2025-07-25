import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAddress, validateAddressUpdate } from '../validations/AddressValidator.js';
import { createAddress, getAllAddressesForUser, updateAddress } from '../controller/address.controller.js';

const router = express.Router();

// http://localhost:5000/api/addresses

router.post('/createAddress', authenticateUser, validateAddress, createAddress);
router.get('/getAddressesByUserId/:id', authenticateUser, getAllAddressesForUser);
router.patch('/update/:id', authenticateUser, validateAddressUpdate, updateAddress);

export default router;