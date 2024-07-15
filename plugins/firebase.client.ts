import { defineNuxtPlugin, useState } from "#app";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7zksZ-giN49TP90kRg02kutBKowEdRK0",
  authDomain: "stagemed-app.firebaseapp.com",
  projectId: "stagemed-app",
  storageBucket: "stagemed-app.appspot.com",
  messagingSenderId: "441362273284",
  appId: "1:441362273284:web:5897b612771ce58ae75151",
  measurementId: "G-F3MK745J6Z",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);

export default defineNuxtPlugin((nuxtApp) => {
  useState("firebaseApp", () => firebaseApp);
  useState("auth", () => auth);
  useState("storage", () => storage);
  useState("db", () => db);
  useState("analytics", () => analytics);
});
