import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth as firebaseGetAuth } from "firebase-admin/auth";

if (!getApps().length) {
  console.log("[Firebase Admin] Initializing...");
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const getAuth = firebaseGetAuth;
