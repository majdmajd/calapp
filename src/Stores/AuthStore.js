import { create } from 'zustand';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';


export const useAuthStore = create((set) => ({
  user: null,

  initiateSignup: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("Verification email sent. Please check your inbox and verify before continuing.");
    await signOut(auth); // Log out immediately to await verification
  },

  login: async (email, password) => {
    console.log("Attempting Firebase login with:", email, password);
    console.log("Firebase auth instance API key:", auth?.app?.options?.apiKey);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }
    set({ user: userCredential.user });
  },

  loginWithGoogle: async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    set({ user: result.user });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  resendVerificationEmail: async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email resent. Please check your inbox.");
    }
  },

  setUser: (user) => set({ user }),
}));