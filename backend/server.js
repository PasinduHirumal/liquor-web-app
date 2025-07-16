import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import initializeFirebase from "./src/config/firebase.config.js";
import { initializeDefaultSuperAdmin } from "./src/initialize/defaultSuperAdminAccount.js";

import authRoutes from "./src/routes/auth.routes.js";
import verifyRoutes from "./src/routes/verify.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import addressRoutes from "./src/routes/address.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";


dotenv.config();

// connect DB
initializeFirebase();

initializeDefaultSuperAdmin().then(() => {
  console.log('✅ Server initialization completed.....\n');
});

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