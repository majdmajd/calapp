import React, { useState } from "react";
import { useAuthStore } from "../Stores/AuthStore";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const initiateSignup = useAuthStore((state) => state.initiateSignup);

  const handleSubmit = async () => {
    console.log("Login button clicked");
    try {
      if (isSignup) {
        await initiateSignup(email, password);
        setError("A verification email has been sent. Please verify your email before continuing.");
      } else {
        await login(username, password);
        onLogin();
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="bg-[#111] p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create your password"
              className="w-full p-3 mt-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        {!isSignup && (
          <>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 mt-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isSignup ? "Send Verification" : "Login"}
        </button>

        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          className="w-full mt-2 text-blue-400 hover:text-blue-500 text-sm"
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("auth-storage");
            window.location.reload();
          }}
          className="w-full mt-4 text-red-500 hover:text-red-600 text-sm"
        >
          Reset All Accounts (Dev Only)
        </button>
      </div>
    </div>
  );
}