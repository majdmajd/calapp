import React from "react";
import { useAuthStore } from "../Stores/AuthStore";

export default function ProfilePage() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div style={{ color: "white", padding: 20 }}>
      <h2>Profile Page</h2>
      <p>Your avatar, level, badges, and outfit will go here.</p>
      <button
        onClick={logout}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
