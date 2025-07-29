import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllDutiesForOrder } from '../controller/driverDuty.controller.js';

const router = express.Router();

// http://localhost:5000/api/driverDuties

router.get('/getAllForOrder/:id', authenticateUser, authorizeRoles("admin", "super_admin"), getAllDutiesForOrder);

export default router;