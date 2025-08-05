import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAdminUserUpdate } from '../validations/AdminUserValidator.js';
import { deleteAdmin, getAdminById, getAllAdmins, updateAdmin } from '../controller/admin.controller.js';

const router = express.Router();

// http://localhost:5000/api/admin

router.get('/getById/:id', authenticateUser, getAdminById);
router.get('/getAll', authenticateUser, authorizeRoles("super_admin"), getAllAdmins);
router.patch('/update/:id', authenticateUser, authorizeRoles("super_admin", "admin"), validateAdminUserUpdate, updateAdmin);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteAdmin);


export default router;