// AppShell.jsx – forwards XP and unlocked skills to each tree
import React, { useState } from "react";
import PullTree from "../components/PullTree";
import PushTree from "../components/PushTree";
import CoreTree from "../components/CoreTree";
import LegsTree from "../components/LegsTree";
import { useSkillStore } from "../Stores/SkillStore"; // ✅ UPDATED

export default function AppShell({ addXp, unlockedSkills }) {
  const [tab, setTab] = useState("pull");

  // 🔁 bring in actions from Zustand
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  const resetAll = useSkillStore((state) => state.resetAll);

  const renderTree = () => {
    switch (tab) {
      case "pull":
        return (
          <PullTree
            addXp={addXp}
            unlockSkill={unlockSkill}
            unlocked={unlockedSkills.pull}
            resetAll={resetAll}
          />
        );
      case "push":
        return (
          <PushTree
            addXp={addXp}
            unlockSkill={unlockSkill}
            unlocked={unlockedSkills.push}
            resetAll={resetAll}
          />
        );
      case "core":
        return (
          <CoreTree
            addXp={addXp}
            unlockSkill={unlockSkill}
            unlocked={unlockedSkills.core}
            resetAll={resetAll}
          />
        );
      case "legs":
        return (
          <LegsTree
            addXp={addXp}
            unlockSkill={unlockSkill}
            unlocked={unlockedSkills.legs}
            resetAll={resetAll}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#000", height: "100%" }}>
      {/* Top tab bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#111",
          borderBottom: "2px solid #222",
          height: 50,
          width: "100%",
        }}
      >
        {["pull", "push", "core", "legs"].map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              backgroundColor: tab === name ? "#3b82f6" : "transparent",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tree container */}
      <div
        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ width: "100%", height: "100%", maxWidth: "1200px" }}>{renderTree()}</div>
      </div>
    </div>
  );
}
