import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllRatingsForProduct } from '../controller/ratings.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/ratings

router.get('/getAll/product/:id', getAllRatingsForProduct);


export default router;