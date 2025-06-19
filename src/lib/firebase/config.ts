import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const connectToEmulators = () => {
        try {
            // Auth emulator
            if (!auth.config.emulator) {
                connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            }

            // Firestore emulator
            if (!db._delegate._databaseId.projectId.includes('demo-')) {
                connectFirestoreEmulator(db, 'localhost', 8080);
            }

            // Storage emulator
            if (!storage._delegate._bucket.includes('demo-')) {
                connectStorageEmulator(storage, 'localhost', 9199);
            }

            // Functions emulator
            if (!functions._delegate._url) {
                connectFunctionsEmulator(functions, 'localhost', 5001);
            }
        } catch (error) {
            console.warn('Error connecting to emulators:', error);
        }
    };

    // Only connect once
    if (!window.fimaEmulatorsConnected) {
        connectToEmulators();
        window.fimaEmulatorsConnected = true;
    }
}

export default app;
