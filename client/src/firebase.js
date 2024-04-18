// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "insightink-b7994.firebaseapp.com",
  projectId: "insightink-b7994",
  storageBucket: "insightink-b7994.appspot.com",
  messagingSenderId: "1009570887385",
  appId: "1:1009570887385:web:d82ccf9563e898967bb0c8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

