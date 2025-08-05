import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createWhereHouse, getCompanyDetails, updateCompanyDetailById } from '../controller/companyDetails.controller.js';
import { validateCompanyDetails, validateCompanyDetailsUpdate } from '../validations/CompanyDetailsValidator.js';

const router = express.Router();

// http://localhost:5000/api/system

router.post('/create', authenticateUser, authorizeRoles("super_admin"), validateCompanyDetails, createWhereHouse);
router.get('/details', authenticateUser, authorizeRoles("admin", "super_admin"), getCompanyDetails);
router.patch('/update/:id', authenticateUser, authorizeRoles("super_admin"), validateCompanyDetailsUpdate, updateCompanyDetailById);

export default router;