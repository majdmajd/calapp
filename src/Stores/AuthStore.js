import { create } from 'zustand';
import { auth, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,

  // 🔵 Signup with email, username, and password
  signup: async (email, username, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      await signOut(auth); // prevent access until verification
    } catch (error) {
      throw error; // send to UI
    }
  },

  // 🔵 Login with email and password, only if verified
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error("Please verify your email before logging in.");
      }

      set({ user });
    } catch (error) {
      throw error;
    }
  },

  // 🔵 Login with Google
  loginWithGoogle: async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error("Please verify your Google email before logging in.");
      }

      set({ user });
    } catch (error) {
      throw error;
    }
  },

  // 🔵 Logout
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  // 🔵 Resend verification email
  resendVerificationEmail: async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("No unverified user is signed in.");
    }
  },

  // 🔵 Set user manually
  setUser: (user) => set({ user }),
}));
