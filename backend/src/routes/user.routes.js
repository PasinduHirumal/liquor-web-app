import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateUserUpdate } from '../validations/UserValidator.js';
import { getAllUsers } from '../controller/user.controller.js';


const router = express.Router();

// http://localhost:5000/api/users

//router.get('/getById/:id', authenticateUser, getAdminById);
router.get('/getAll', authenticateUser, authorizeRoles("super_admin"), getAllUsers)

/*router.patch('/update/:id', authenticateUser, authorizeRoles("super_admin", "admin"), validateAdminUserUpdate, updateAdmin);
router.delete('/delete/:id', authenticateUser, authorizeRoles("super_admin"), deleteAdmin);
*/

export default router;