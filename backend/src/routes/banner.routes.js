import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createBanner, deleteBannerById, getAllBanners, getBannerById, updateBannerById } from '../controller/banner.controller.js';
import { validateBanner, validateBannerUpdate } from '../validations/BannerValidator.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/banners

router.get('/getAll', getAllBanners);
router.get('/getBanner/:id', authenticateUser, authorizeRoles(admin, super_admin), getBannerById);
router.post('/create', authenticateUser, authorizeRoles(super_admin), validateBanner, createBanner);
router.patch('/update/:id', authenticateUser, authorizeRoles(super_admin), validateBannerUpdate, updateBannerById);
router.delete('/delete', authenticateUser, authorizeRoles(super_admin), deleteBannerById);

export default router;