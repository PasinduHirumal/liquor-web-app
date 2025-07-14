import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../validations/UserValidator.js';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controller/user.controller.js';


const router = express.Router();

// http://localhost:5000/api/users

router.get('/getUserById/:id', authenticateUser, getUserById);
router.get('/getAll', authenticateUser, authorizeRoles("super_admin"), getAllUsers)
router.patch('/update/:id', authenticateUser, validateUserUpdate, updateUser);
router.delete('/delete/:id', authenticateUser, deleteUser);


export default router;