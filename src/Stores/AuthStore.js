import { create } from 'zustand';
import { auth, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,

  // 🔹 Create account with email/password + username
  signup: async (email, username, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      await signOut(auth); // require email verification
    } catch (error) {
      throw error;
    }
  },

  // 🔹 Login with email/password (if verified)
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

  // 🔹 Login with Google (popup for desktop, redirect for mobile)
  loginWithGoogle: async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      await signInWithRedirect(auth, googleProvider); // redirect flow
    } else {
      const result = await signInWithPopup(auth, googleProvider); // desktop popup
      const user = result.user;
      set({ user });
      return result; // return so LoginPage can check new user
    }
  },

  // 🔹 Get redirect result after Google login on mobile
  handleRedirectResult: async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        set({ user: result.user });
        return result;
      }
      return null;
    } catch (error) {
      console.error("Google redirect error:", error);
      return null;
    }
  },

  // 🔹 Logout
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  // 🔹 Resend verification email
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

  // 🔹 Set user manually (e.g., after redirect or polling)
  setUser: (user) => set({ user }),
}));
