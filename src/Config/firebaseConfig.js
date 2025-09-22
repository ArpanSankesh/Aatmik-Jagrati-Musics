// src/Config/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9kvNqsFEVXb_rYVhdBqox_A7LD56nr4I",
    authDomain: "aatmikjagratimusics.firebaseapp.com",
    projectId: "aatmikjagratimusics",
    storageBucket: "aatmikjagratimusics.firebasestorage.app",
    messagingSenderId: "219264603558",
    appId: "1:219264603558:web:c282eb09d81ad94043ab67",
    measurementId: "G-QWK91ZGZYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app); 

export default app;