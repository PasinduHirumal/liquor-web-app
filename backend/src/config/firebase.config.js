import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();


const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        // database URL for full Realtime Database access
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      
      console.log('✅ Firebase initialized successfully...');
    }
    return {
      db: admin.firestore(),
      auth: admin.auth(),
      storage: admin.storage(),
      messaging: admin.messaging(),
      admin 
    };
  } catch (error) {
    console.error(`❌ Firebase initialization error: ${error.message}`);
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
};

export default initializeFirebase;