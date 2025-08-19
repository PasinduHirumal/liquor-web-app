import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateCompanyDetails, validateCompanyDetailsUpdate } from '../validations/CompanyDetailsValidator.js';
import { createWareHouse, deleteWarehouseById, getAllWarehouses, updateWarehouseById } from '../controller/companyDetails.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/system

router.post('/create', authenticateUser, authorizeRoles(super_admin), validateCompanyDetails, createWareHouse);
router.get('/details', authenticateUser, authorizeRoles(admin, super_admin), getAllWarehouses);
router.patch('/update/:id', authenticateUser, authorizeRoles(super_admin), validateCompanyDetailsUpdate, updateWarehouseById);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteWarehouseById);

export default router;