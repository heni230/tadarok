import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔐 إعدادات مشروع Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCcAeuCluYBMra4Dc4Tb5Sxif5KIizAXA",
  authDomain: "heni55488.firebaseapp.com",
  projectId: "heni55488",
  storageBucket: "heni55488.appspot.com",
  messagingSenderId: "809928867441",
  appId: "1:809928867441:web:c9a563b6fef907de1625d0",
  measurementId: "G-Y6RMQKKS7J"
};

// 🚀 التهيئة والربط
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);   // 🗄️ قاعدة البيانات Firestore
export const auth = getAuth(app);      // 🔐 المصادقة Firebase Auth

export default app;
