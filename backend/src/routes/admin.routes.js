import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAdminUserImportantFieldsUpdate, validateAdminUserUpdate } from '../validations/AdminUserValidator.js';
import { deleteAdmin, getAdminById, getAllAdmins, updateAdminById, updateAdminImportantFieldsById } from '../controller/admin.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/admin

router.get('/getById/:id', authenticateUser, getAdminById);
router.get('/getAll', authenticateUser, authorizeRoles(super_admin), getAllAdmins);
router.patch('/update/:id', authenticateUser, authorizeRoles(super_admin), validateAdminUserImportantFieldsUpdate, updateAdminImportantFieldsById);
router.patch('/update/myself/:id', authenticateUser, authorizeRoles(admin, super_admin), validateAdminUserUpdate, updateAdminById);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteAdmin);


export default router;