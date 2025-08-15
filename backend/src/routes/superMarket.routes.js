import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createMarket, getAllMarkets, getMarketById, migrateSearchTokens, searchMarketsAdvanced, updateMarketById } from '../controller/superMarket.controller.js';
import { validateSuperMarket, validateSuperMarketUpdate } from '../validations/SuperMarketValidator.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/superMarket

router.post('/create', authenticateUser, authorizeRoles(admin, super_admin), validateSuperMarket, createMarket);
router.get('/getAll', authenticateUser, authorizeRoles(admin, super_admin), getAllMarkets);
router.get('/search', authenticateUser, authorizeRoles(admin, super_admin), searchMarketsAdvanced);
router.get('/getById/:id', authenticateUser, authorizeRoles(admin, super_admin), getMarketById);
router.patch('/update/:id', authenticateUser, authorizeRoles(admin, super_admin), validateSuperMarketUpdate, updateMarketById);

//  Run this end-point once to add search tokens to existing documents after create & update
router.post('/migrate', authenticateUser, authorizeRoles(admin, super_admin), migrateSearchTokens);


export default router;