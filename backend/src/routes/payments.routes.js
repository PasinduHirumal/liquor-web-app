import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateDriverPayments } from '../validations/DriverPayments.js';
import { getPaymentHistoryForDriver, payToDriverByDriverId } from '../controller/driverPayments.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/payment

router.post('/driver/:id', authenticateUser, authorizeRoles(super_admin), validateDriverPayments, payToDriverByDriverId);
router.get('/history/driver/:id', authenticateUser, authorizeRoles(super_admin), getPaymentHistoryForDriver);


export default router;