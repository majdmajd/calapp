import React, { useEffect, useState } from "react";
import { useAuthStore } from "../Stores/AuthStore";
import { auth } from "../firebase";

export default function LoginPage() {
  const { signup, login, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  // 🔁 Auto-check for email verification
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          setUser(currentUser);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
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
    } catch (error) {
      const msg = "❌ " + (error?.message || "Login failed.");
      setMessage(msg);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  const toggleLogin = () => setIsLogin(!isLogin);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-[#111] p-6 rounded-lg shadow-lg w-full max-w-sm">
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

        {/* ✅ Message Card */}
        {message && (
          <div className="mt-6 bg-blue-900 border border-blue-600 text-blue-100 px-4 py-3 rounded text-sm flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="ml-4 text-blue-300 hover:text-white">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
