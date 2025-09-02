import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProduct, deleteProductById, getAllProducts, getProductById, migrateSearchTokens, updatePriceById, updateProductById, updateStockById } from '../controller/otherProducts.controller.js';
import { validateOtherProduct, validateOtherProductUpdate, validatePriceOperation, validateQuantityOperation } from '../validations/OtherProductValidator.js';
import { searchProductAdvanced } from '../controller/search.controller.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/other-products

router.get('/getAll', getAllProducts);
router.get('/getAll/dashboard', authenticateUser, authorizeRoles(admin, super_admin), getAllProducts);
router.get('/getOtherProductById/:id', authenticateUser, authorizeRoles(admin, super_admin), getProductById);
router.post('/create', authenticateUser, authorizeRoles(admin, super_admin), validateOtherProduct, createProduct);
router.patch('/update/:id', authenticateUser, authorizeRoles(admin, super_admin), validateOtherProductUpdate, updateProductById);
router.patch('/update-price/:id', authenticateUser, authorizeRoles(admin, super_admin), validatePriceOperation, updatePriceById);
router.patch('/update-quantity/:id', authenticateUser, authorizeRoles(admin, super_admin), validateQuantityOperation, updateStockById);
router.delete('/delete/:id', authenticateUser, authorizeRoles(super_admin), deleteProductById);

//  Run this end-point once to add search tokens to existing documents after create & update
router.post('/migrate', authenticateUser, authorizeRoles(admin, super_admin), migrateSearchTokens);

// Advanced search for grocery items
router.get('/search/feed', searchProductAdvanced);
router.get('/search/dashboard', authenticateUser, authorizeRoles(admin, super_admin), searchProductAdvanced);

export default router;