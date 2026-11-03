import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAxQiqn65CeMDl9L7U-TH-e1yc3khfm4gY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'skypulse-weather-d78b7.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'skypulse-weather-d78b7',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'skypulse-weather-d78b7.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1046050711785',
  appId: env.VITE_FIREBASE_APP_ID || '1:1046050711785:web:34a0340a3287de650ca878',
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  !firebaseConfig.apiKey.includes('your_') &&
  firebaseConfig.apiKey !== ''
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
  }
} else {
  console.warn(
    'Firebase environment variables (VITE_FIREBASE_*) are not configured. Forecast lock is active.'
  );
}

export { auth, googleProvider };

