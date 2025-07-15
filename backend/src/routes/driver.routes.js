import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateDriver } from '../validations/DriverValidator.js';
import { createDriver } from '../controller/driver.controller.js';


const router = express.Router();

// http://localhost:5000/api/drivers

router.post('/createDriver', authenticateUser, authorizeRoles("super_admin", "admin"), validateDriver, createDriver);

export default router;