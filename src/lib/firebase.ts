import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Vjay's Bike Inventory Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj7YEb-c0Yi7hwIDbus8QxH06OQ-f-cU4",
  authDomain: "vjays-bike-inventory.firebaseapp.com",
  projectId: "vjays-bike-inventory",
  storageBucket: "vjays-bike-inventory.firebasestorage.app",
  messagingSenderId: "294848414786",
  appId: "1:294848414786:web:1c44c25f515d55426e19db",
  measurementId: "G-52G0KPN8LJ"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
