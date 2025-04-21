import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Stores/AuthStore";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { getRedirectResult } from "firebase/auth";

export default function LoginPage({ onLogin }) {
  const { signup, login, loginWithGoogle, handleRedirectResult, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  // For new Google users
  const [isGoogleNewUser, setIsGoogleNewUser] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  // 🔁 Poll for email verification
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setUser(currentUser);
          clearInterval(interval);
          if (onLogin) onLogin();
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle redirect result for mobile Google login
  useEffect(() => {
    handleRedirectResult().then((result) => {
      if (result?.user) {
        const user = result.user;
        if (!user.displayName) {
          setIsGoogleNewUser(true);
          setPendingGoogleUser(user);
        } else {
          setUser(user);
          if (onLogin) onLogin();
        }
      }
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, username, password);
      setMessage("✅ Verification email sent. Please check your inbox.");
    } catch (error) {
      const msg =
        error?.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ? "❌ Password should be at least 6 characters."
          : "❌ " + (error?.message || "Signup failed.");
      setMessage(msg);
    }
    setTimeout(() => setMessage(null), 6000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (onLogin) onLogin();
    } catch (error) {
      const msg = "❌ " + (error?.message || "Login failed.");
      setMessage(msg);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result?.user) {
        const user = result.user;
        if (!user.displayName) {
          setIsGoogleNewUser(true);
          setPendingGoogleUser(user);
        } else {
          setUser(user);
          if (onLogin) onLogin();
        }
      }
    } catch (error) {
      const msg = "❌ " + (error?.message || "Google login failed.");
      setMessage(msg);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  const handleGoogleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername || !pendingGoogleUser) return;

    try {
      await updateProfile(pendingGoogleUser, { displayName: newUsername });
      setUser({ ...pendingGoogleUser, displayName: newUsername });
      if (onLogin) onLogin();
    } catch (error) {
      setMessage("❌ Failed to save username.");
    }
  };

  const toggleLogin = () => setIsLogin(!isLogin);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-[#111] p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <h1 className="text-2xl font-bold mb-4">{isLogin ? "Log In" : "Sign Up"}</h1>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-[#222] border border-[#333] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Username"
                className="p-2 rounded bg-[#222] border border-[#333] text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-[#222] border border-[#333] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}
          {isLogin && (
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded bg-[#222] border border-[#333] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>

          {/* ✅ Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bg-white text-black flex items-center justify-center gap-2 font-semibold py-2 rounded hover:bg-gray-200 transition-colors"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {isLogin ? "Continue with Google" : "Sign Up with Google"}
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-400">
          {isLogin
            ? "Don't have an account?"
            : "Already signed up? Click below to log in"}
        </p>
        <button
          onClick={toggleLogin}
          className="text-blue-400 underline mt-1 text-sm"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>

        {!isLogin && (
          <p className="text-xs mt-4 text-gray-500">
            A verification email will be sent after you sign up. Please check your inbox.
            Once you've verified, return here and log in with your email and password.
          </p>
        )}

        {message && (
          <div className="mt-6 bg-blue-900 border border-blue-600 text-blue-100 px-4 py-3 rounded text-sm flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="ml-4 text-blue-300 hover:text-white">✕</button>
          </div>
        )}

        {/* ✅ Username modal for new Google users */}
        {isGoogleNewUser && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-bold mb-4">Create a Username</h2>
              <form onSubmit={handleGoogleUsernameSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="p-2 rounded bg-[#222] border border-[#333] text-white"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
