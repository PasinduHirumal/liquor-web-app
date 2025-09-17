import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../validations/UserValidator.js';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controller/user.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/users

router.get('/getUserById/:id', authenticateUser, getUserById);
router.get('/getAll', authenticateUser, authorizeRoles(super_admin), getAllUsers)
router.patch('/update/:id', authenticateUser, authorizeRoles(super_admin), validateUserUpdate, updateUser);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteUser);


export default router;