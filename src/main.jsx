import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import MainShell from './pages/MainShell';
import "../index.css";  
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "./Stores/AuthStore";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        useAuthStore.getState().setUser(user);
      } else if (user && !user.emailVerified) {
        console.warn("User not verified yet");
        auth.signOut();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return <MainShell />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);