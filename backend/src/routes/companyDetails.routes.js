import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getCompanyDetails } from '../controller/companyDetails.controller.js';

const router = express.Router();

// http://localhost:5000/api/system

router.get('/details', authenticateUser, authorizeRoles("admin", "super_admin"), getCompanyDetails);

export default router;