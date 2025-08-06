// Firebase configuration
// Firebase project configuration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASeIAXZMMTpQEToTNmGleemm2PG-9eofo",
  authDomain: "yogaadminapp1.firebaseapp.com",
  projectId: "yogaadminapp1",
  storageBucket: "yogaadminapp1.firebasestorage.app",
  messagingSenderId: "680603186213",
  appId: "1:680603186213:web:56c8a83493a7eb56b3bbcc"
};

// Initialize Firebase
console.log('Initializing Firebase with config:', JSON.stringify({
  apiKey: firebaseConfig.apiKey ? 'PRESENT' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
}));

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;