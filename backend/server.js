import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import initializeFirebase from "./src/config/firebase.config.js";
import { initializeDefaultSuperAdmin } from "./src/initialize/defaultSuperAdminAccount.js";

import authRoutes from "./src/routes/auth.routes.js";
import verifyRoutes from "./src/routes/verify.routes.js";

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