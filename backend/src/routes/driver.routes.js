import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateDriver, validateDriverUpdate } from '../validations/DriverValidator.js';
import { createDriver, deleteDriver, getAllDrivers, updateDriver } from '../controller/driver.controller.js';


const router = express.Router();

// http://localhost:5000/api/drivers

router.post('/createDriver', authenticateUser, authorizeRoles("super_admin", "admin"), validateDriver, createDriver);
router.get('/allDrivers', authenticateUser, authorizeRoles("super_admin", "admin"), getAllDrivers);
router.patch('/update/:id', authenticateUser, authorizeRoles("super_admin", "admin"), validateDriverUpdate, updateDriver);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteDriver);

export default router;