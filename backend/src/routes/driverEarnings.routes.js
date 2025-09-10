import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllEarningsForDriverById } from '../controller/driverEarnings.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/earning

router.get('/driver/:id', authenticateUser, authorizeRoles(admin, super_admin), getAllEarningsForDriverById);


export default router;