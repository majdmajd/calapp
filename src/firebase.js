import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDdBsON56_slmHl4q3l-sU-TrUUPGcai4A",
    authDomain: "calapp-77311.firebaseapp.com",
    projectId: "calapp-77311",
    storageBucket: "calapp-77311.appspot.com", // also fix ".app" typo
    messagingSenderId: "403339220337",
    appId: "1:403339220337:web:3fd2f796c2385d60ca52d0",
  };

console.log("Initializing Firebase with config:", firebaseConfig);
console.log("Firebase API Key:", firebaseConfig.apiKey);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
  await signInWithRedirect(auth, googleProvider);
};