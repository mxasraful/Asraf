import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { GoogleGenAI } from "@google/genai";

const firebaseConfig = {
  apiKey: "AIzaSyBW5IZjLWH4s2vlDPTFRVS8yulBZbN_SEU",
  authDomain: "asrafs-portfolio.firebaseapp.com",
  projectId: "asrafs-portfolio",
  storageBucket: "asrafs-portfolio.firebasestorage.app",
  messagingSenderId: "150965846355",
  appId: "1:150965846355:web:17e68c260d64f89e80a1a6",
  measurementId: "G-P6GMZQ62S7"
};

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export service instances directly from the initialized app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally
export const analyticsPromise = typeof window !== 'undefined' ? 
  isSupported().then(yes => yes ? getAnalytics(app) : null) : 
  Promise.resolve(null);

// Initialize Google GenAI
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default app;