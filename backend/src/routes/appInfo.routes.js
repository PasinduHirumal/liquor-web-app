import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateAppInfoUpdate, validateLiquorActiveToggleUpdate } from '../validations/AppInfoValidator.js';
import { getAllAppData, getMainAppInfo, updateActiveToggle, updateAppInfoById } from '../controller/appInfo.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/appInfo

router.get('/getAll', authenticateUser, authorizeRoles(super_admin), getAllAppData);
router.get('/getMainAppInfo', authenticateUser, authorizeRoles(super_admin), getMainAppInfo);
router.patch('/update/:id', authenticateUser, authorizeRoles(super_admin), validateAppInfoUpdate, updateAppInfoById);
router.patch('/update/liquor_toggle', authenticateUser, authorizeRoles(super_admin), validateLiquorActiveToggleUpdate, updateActiveToggle);


export default router;