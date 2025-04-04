// MainShell.jsx – App wrapper with bottom tab navigation + XP state
import React, { useState } from "react";
import AppShell from "./AppShell";
import LevelsPage from "./LevelsPage";
import ProgressPage from "./ProgressPage";
import ProfilePage from "./ProfilePage";
import { FaHome, FaChartLine, FaUser, FaDumbbell } from "react-icons/fa";

export default function MainShell() {
  const [tab, setTab] = useState("home");
  const [xpData, setXpData] = useState({ push: 0, pull: 0, core: 0, legs: 0 });

  const addXp = (category, amount) => {
    setXpData(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + amount
    }));
  };

  const renderTab = () => {
    switch (tab) {
      case "home":
        return <AppShell addXp={addXp} />;
      case "levels":
        return <LevelsPage xpData={xpData} />;
      case "progress":
        return <ProgressPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <AppShell addXp={addXp} />;
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", background: "#000", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>{renderTab()}</div>

      {/* Bottom Navigation */}
      <div style={{ display: "flex", justifyContent: "space-around", backgroundColor: "#111", height: 56, borderTop: "1px solid #333" }}>
        {[
          { key: "home", icon: <FaDumbbell />, label: "Tree" },
          { key: "levels", icon: <FaChartLine />, label: "Levels" },
          { key: "progress", icon: <FaHome />, label: "Progress" },
          { key: "profile", icon: <FaUser />, label: "Profile" }
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              background: "transparent",
              color: tab === key ? "#3b82f6" : "#ccc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              fontSize: 12,
              padding: 6,
              cursor: "pointer"
            }}
          >
            <div style={{ fontSize: 20 }}>{icon}</div>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}