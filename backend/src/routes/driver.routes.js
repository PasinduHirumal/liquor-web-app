import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateDocumentUpdate, validateDriver, validateDriverUpdate, validateFinancialUpdate, validateLocationAndDeliveryUpdate, validatePerformanceAndRatingUpdate, validateQualificationsUpdate, validateVehicleInformationUpdate } from '../validations/DriverValidator.js';
import { createDriver, deleteDriver, getAllDrivers, getDriverById, updateDriver } from '../controller/driver.controller.js';


const router = express.Router();

// http://localhost:5000/api/drivers

router.post('/createDriver', authenticateUser, authorizeRoles("super_admin", "admin"), validateDriver, createDriver);
router.get('/allDrivers', authenticateUser, authorizeRoles("super_admin", "admin"), getAllDrivers);
router.get('/getDriverById/:id', authenticateUser, authorizeRoles("super_admin", "admin"), getDriverById);
router.patch('/update/:id', authenticateUser, authorizeRoles("super_admin", "admin", "driver"), validateDriverUpdate, updateDriver);
router.patch('/update-vehicleInfo/:id', authenticateUser, authorizeRoles("super_admin", "admin", "driver"), validateVehicleInformationUpdate, updateDriver);
router.patch('/update-locationAndDelivery/:id', authenticateUser, authorizeRoles("super_admin", "admin", "driver"), validateLocationAndDeliveryUpdate, updateDriver);
router.patch('/update-performanceAndRating/:id', authenticateUser, authorizeRoles("super_admin", "admin", "user"), validatePerformanceAndRatingUpdate, updateDriver);
router.patch('/update-financial/:id', authenticateUser, authorizeRoles("super_admin", "admin", "driver"), validateFinancialUpdate, updateDriver);
router.patch('/update-document/:id', authenticateUser, authorizeRoles("super_admin", "admin", "driver"), validateDocumentUpdate, updateDriver);
router.patch('/update-qualifications/:id', authenticateUser, authorizeRoles("super_admin"), validateQualificationsUpdate, updateDriver);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteDriver);

export default router;