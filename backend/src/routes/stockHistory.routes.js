import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getStockHistoryByProductId } from '../controller/stockHistory.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/stockHistory

router.get('/getByProductId/:id', authenticateUser, authorizeRoles(admin, super_admin), getStockHistoryByProductId);

export default router;