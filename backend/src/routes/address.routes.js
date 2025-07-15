import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAddress } from '../validations/AddressValidator.js';
import { createAddress, getAllAddressesForUser } from '../controller/address.controller.js';

const router = express.Router();

// http://localhost:5000/api/addresses

router.post('/createAddress', authenticateUser, validateAddress, createAddress);
router.get('/myAddresses', authenticateUser, getAllAddressesForUser);


export default router;