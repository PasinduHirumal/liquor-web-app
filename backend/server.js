import dotenv from "dotenv";
dotenv.config();

// Verify environment variables are loaded
console.log('🔍 Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('- FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
console.log('- FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY?.length);
console.log('- FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import initializeFirebase from "./src/config/firebase.config.js";
import { initializeDefaultSuperAdmin } from "./src/initialize/defaultSuperAdminAccount.js";
import { initializeDefaultCompanyDetails } from "./src/initialize/defaultCompanyDetails.js";
import { initializeDefaultAppInfo } from "./src/initialize/defaultAppInfo.js";

import authRoutes from "./src/routes/auth.routes.js";
import verifyRoutes from "./src/routes/verify.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import addressRoutes from "./src/routes/address.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import otherProductRoutes from "./src/routes/otherProducts.routes.js";
import stockHistoryRoutes from "./src/routes/stockHistory.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js";
import driverDutyRoutes from "./src/routes/driverDuty.routes.js";
import companyDetailsRoutes from "./src/routes/companyDetails.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import bannerRoutes from "./src/routes/banner.routes.js";
import superMarketRoutes from "./src/routes/superMarket.routes.js";
import appInfoRoutes from "./src/routes/appInfo.routes.js";



// connect DB
initializeFirebase();

const initializeDefaults = async () => {
  try {
    await initializeDefaultSuperAdmin();
    await initializeDefaultCompanyDetails();
    await initializeDefaultAppInfo();
    console.log('✅ Server initialization completed.....\n');
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
  }
};

initializeDefaults();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

//Routes 
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/other-products", otherProductRoutes);
app.use("/api/stockHistory", stockHistoryRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/driverDuties", driverDutyRoutes);
app.use("/api/system", companyDetailsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/superMarket", superMarketRoutes);
app.use("/api/appInfo", appInfoRoutes);


//  Route handler for the root path
app.get('/', (req, res) => {
  res.send('✅ Server is running...!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));