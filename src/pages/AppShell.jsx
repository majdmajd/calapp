import React, { useState, useRef, useCallback, useEffect } from "react";
import PullTree from "../components/PullTree";
import PushTree from "../components/PushTree";
import CoreTree from "../components/CoreTree";
import LegsTree from "../components/LegsTree";

export default function AppShell({ unlockedSkills, unlockSkill }) {
  const [tab, setTab] = useState("pull");

  const trees = {
    pull: <PullTree unlockedSkills={unlockedSkills} unlockSkill={unlockSkill} />,
    push: <PushTree fitViewTrigger={tab} unlockedSkills={unlockedSkills} unlockSkill={unlockSkill} />,
    core: <CoreTree unlockedSkills={unlockedSkills} unlockSkill={unlockSkill} />,
    legs: <LegsTree unlockedSkills={unlockedSkills} unlockSkill={unlockSkill} />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
        {Object.keys(trees).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              padding: 10,
              fontSize: 14,
              fontWeight: "bold",
              color: tab === key ? "#3b82f6" : "#ccc",
              borderBottom: tab === key ? "2px solid #3b82f6" : "none",
              background: "transparent",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>{trees[tab]}</div>
    </div>
  );
}
