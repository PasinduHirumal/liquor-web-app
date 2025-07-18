import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getStockHistoryByProductId } from '../controller/stockHistory.controller.js';

const router = express.Router();

// http://localhost:5000/api/stockHistory

router.get('/getByProductId/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getStockHistoryByProductId);

export default router;