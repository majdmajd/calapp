import React from "react";
import { FaHome, FaChartLine, FaUser, FaDumbbell } from "react-icons/fa";

export default function BottomNavigation({ currentTab, setTab }) {
  const tabs = [
    { key: "home", icon: <FaDumbbell />, label: "Home" },
    { key: "levels", icon: <FaChartLine />, label: "Levels" },
    { key: "progress", icon: <FaHome />, label: "Progress" },
    { key: "profile", icon: <FaUser />, label: "Profile" },
  ];

  return (
    <div className="flex justify-around items-center bg-black border-t border-gray-700 h-16 text-white fixed bottom-0 w-full z-50">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setTab(tab.key)}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentTab === tab.key ? "text-blue-500" : "text-gray-400"
          }`}
        >
          {tab.icon}
          <span className="text-xs">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}