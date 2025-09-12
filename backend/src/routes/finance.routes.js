import express from 'express';
import ADMIN_ROLES from '../enums/adminRoles.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
import { getAllWithdrawalHistory, getCashSummery, withdrawProfitedCash } from '../controller/finance.controller.js';
import { validateMoneyWithdraw } from '../validations/MoneyWithdrawValidator.js';

const router = express.Router();

const admin = ADMIN_ROLES.ADMIN;
const super_admin = ADMIN_ROLES.SUPER_ADMIN;

// http://localhost:5000/api/finance

router.get('/summery', authenticateUser, authorizeRoles(super_admin), getCashSummery);
router.get('/withdraw_history', authenticateUser, authorizeRoles(super_admin), getAllWithdrawalHistory);
router.post('/withdraw_cash', authenticateUser, authorizeRoles(super_admin), validateMoneyWithdraw, withdrawProfitedCash);

export default router;