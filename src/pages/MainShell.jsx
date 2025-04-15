import React, { useState } from "react";
import AppShell from "./AppShell";
import LevelsPage from "./LevelsPage";
import ProgressPage from "./ProgressPage";
import ProfilePage from "./ProfilePage";
import TailwindTestPage from "./TailwindTestPage";
import { FaHome, FaChartLine, FaUser, FaDumbbell } from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";
import { useSkillStore } from "../Stores/SkillStore";

export default function MainShell() {
  const [tab, setTab] = useState("home");
  const { xpData, unlockedSkills, unlockSkill } = useSkillStore();

  const renderTab = () => {
    switch (tab) {
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
      case "test":
        return <TailwindTestPage />;
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
    <div className="h-screen w-screen bg-black flex flex-col text-white">
      <div className="flex-grow overflow-hidden">{renderTab()}</div>

      {/* ✅ Tailwind Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-t border-white/10">
        <div className="grid grid-cols-5 py-2 text-sm text-white/60">
          {[
            { key: "home", icon: <FaDumbbell />, label: "Tree" },
            { key: "levels", icon: <FaChartLine />, label: "Levels" },
            { key: "progress", icon: <FaHome />, label: "Progress" },
            { key: "profile", icon: <FaUser />, label: "Profile" },
            { key: "test", icon: <LayoutDashboard />, label: "Test" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                tab === key ? "text-blue-500" : "hover:text-white"
              }`}
            >
              <div className="text-xl">{icon}</div>
              <span className="mt-1 text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
