import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAdminUserUpdate } from '../validations/AdminUserValidator.js';
import { getAllAdmins, updateAdmin } from '../controller/admin.controller.js';

const router = express.Router();

// http://localhost:5000/api/admin

router.get('/getAll', authenticateUser, authorizeRoles("super_admin"), getAllAdmins)
router.patch('/update/:id', validateAdminUserUpdate, authenticateUser, updateAdmin);


export default router;