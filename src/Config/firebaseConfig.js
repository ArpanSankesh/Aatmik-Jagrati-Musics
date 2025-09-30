// src/Config/firebaseConfig.js

// 1. Import all the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // You were missing this import

// 2. Your web app's Firebase configuration
// IMPORTANT: Please double-check that this is the EXACT key from your Firebase project settings.
// This is the most common source of the "API key not valid" error.
const firebaseConfig = {
  apiKey: "AIzaSyD9kvNqsFEVXb_rYVhdBqox_A7LD56nr4I", // <-- Re-copy this from your Firebase Console
  authDomain: "aatmikjagratimusics.firebaseapp.com",
  projectId: "aatmikjagratimusics",
  storageBucket: "aatmikjagratimusics.appspot.com", // <-- Corrected from .firebasestorage.app
  messagingSenderId: "219264603558",
  appId: "1:219264603558:web:c282eb09d81ad94043ab67",
  measurementId: "G-QWK9_ZGZYE" // It seems there was a typo here, check if it should be QWK91ZGZYE
};

// 3. Initialize Firebase and its services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. Initialize Firebase Auth and the Google Provider
// This section was completely missing and is required for login to work.
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 

// 5. Export the main app instance (optional, but good practice)
export default app;