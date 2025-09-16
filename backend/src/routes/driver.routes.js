import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import USER_ROLES from '../enums/userRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateDocumentUpdate, validateDriver, validateDriverUpdate, validateFinancialUpdate, validateLocationAndDeliveryUpdate, validatePerformanceAndRatingUpdate, validateQualificationsUpdate, validateVehicleInformationUpdate } from '../validations/DriverValidator.js';
import { createDriver, deleteDriver, getAllDrivers, getDriverById, updateDriver } from '../controller/driver.controller.js';
import { getOrdersHistoryForDriverById } from '../controller/orders.controller.js';


const router = express.Router();

const user = USER_ROLES.USER;
const driver = USER_ROLES.DRIVER;
const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/drivers

router.post('/createDriver', authenticateUser, authorizeRoles(admin, super_admin), validateDriver, createDriver);
router.get('/allDrivers', authenticateUser, authorizeRoles(admin, super_admin), getAllDrivers);
router.get('/getDriverById/:id', authenticateUser, authorizeRoles(admin, super_admin), getDriverById);
router.get('/orders_history/:id', authenticateUser, authorizeRoles(admin, super_admin), getOrdersHistoryForDriverById);
router.patch('/update/:id', authenticateUser, authorizeRoles(admin, super_admin, driver), validateDriverUpdate, updateDriver);
router.patch('/update-vehicleInfo/:id', authenticateUser, authorizeRoles(admin, super_admin, driver), validateVehicleInformationUpdate, updateDriver);
router.patch('/update-locationAndDelivery/:id', authenticateUser, authorizeRoles(admin, super_admin, driver), validateLocationAndDeliveryUpdate, updateDriver);
router.patch('/update-performanceAndRating/:id', authenticateUser, authorizeRoles(admin, super_admin, user), validatePerformanceAndRatingUpdate, updateDriver);
router.patch('/update-financial/:id', authenticateUser, authorizeRoles(admin, super_admin, driver), validateFinancialUpdate, updateDriver);
router.patch('/update-document/:id', authenticateUser, authorizeRoles(admin, super_admin, driver), validateDocumentUpdate, updateDriver);
router.patch('/update-qualifications/:id', authenticateUser, authorizeRoles(super_admin), validateQualificationsUpdate, updateDriver);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteDriver);

export default router;