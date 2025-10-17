// src/config/firebaseconfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase (datos sensibles ofuscados para el ejemplo)
const firebaseConfig = {
    apiKey: "AIzaSyC0sNHdbL5zR4HT-xQPOuTzKn8u-nfp7P4",
    authDomain: "vamoapp-16900.firebaseapp.com",
    projectId: "vamoapp-16900",
    storageBucket: "vamoapp-16900.firebasestorage.app",
    messagingSenderId: "451096373527",
    appId: "1:451096373527:web:81809ff32d559976506f52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);