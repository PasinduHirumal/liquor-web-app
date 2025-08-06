import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getOrdersReport } from '../controller/reports.controller.js';

const router = express.Router();

// http://localhost:5000/api/reports

router.get('/orders', authenticateUser, authorizeRoles("super_admin"), getOrdersReport);

export default router;