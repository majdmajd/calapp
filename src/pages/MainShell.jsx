import React, { useState } from "react";
import AppShell from "./AppShell";
import LevelsPage from "./LevelsPage";
import ProgressPage from "./ProgressPage";
import ProfilePage from "./ProfilePage";
import { FaHome, FaChartLine, FaUser, FaDumbbell } from "react-icons/fa";
import { useSkillStore } from "../Stores/SkillStore"; // ✅ UPDATED
import { LayoutDashboard } from "lucide-react";
import TailwindTestPage from "./TailwindTestPage";
import { FaFlask } from "react-icons/fa"; // for a test tube icon




export default function MainShell() {
  const [tab, setTab] = useState("home");

  // ✅ Get data and function from global store
  const { xpData, unlockedSkills, unlockSkill } = useSkillStore();

  const renderTab = () => {
    switch (tab) {
      case "test":
  return <TailwindTestPage />;

      case "home":
        return (
          <AppShell
            unlockSkill={unlockSkill}
            unlockedSkills={unlockedSkills}
          />
        );
      case "levels":
        return <LevelsPage xpData={xpData} />;
      case "progress":
        return <ProgressPage />;
      case "profile":
        return <ProfilePage />;
      case "icons":
        return <SkillIconGallery />;

      default:
        return (
          <AppShell
            unlockSkill={unlockSkill}
            unlockedSkills={unlockedSkills}
          />
        );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>{renderTab()}</div>

      {/* Bottom Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#111",
          height: 56,
          borderTop: "1px solid #333",
        }}
      >
        {[
          { key: "home", icon: <FaDumbbell />, label: "Tree" },
          { key: "levels", icon: <FaChartLine />, label: "Levels" },
          { key: "progress", icon: <FaHome />, label: "Progress" },
          { key: "profile", icon: <FaUser />, label: "Profile" },
          { key: "icons", icon: <LayoutDashboard />, label: "Icons" },
          { key: "test", icon: <FaFlask />, label: "Test" },

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
              cursor: "pointer",
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