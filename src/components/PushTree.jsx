import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSkillStore } from "../Stores/SkillStore";

const pushSkills = [
  { id: "kneePushups", label: "🦵", fullLabel: "Knee Push-Ups (2x8)", position: { x: -120, y: 500 }, xp: 2 },
  { id: "inclinePushups", label: "📀", fullLabel: "Incline Push-Ups (2x8)", requires: ["kneePushups"], position: { x: -120, y: 400 }, xp: 3 },
  { id: "pushups", label: "🡜", fullLabel: "Push-Ups (2x8)", requires: ["inclinePushups"], position: { x: -120, y: 300 }, xp: 4 },
  { id: "archerPushups", label: "🌽", fullLabel: "Archer Push-Ups (2x6)", requires: ["pushups"], position: { x: -120, y: 200 }, xp: 6 },

  { id: "benchDips", label: "🪑", fullLabel: "Bench Dips (2x10)", position: { x: 0, y: 500 }, xp: 2 },
  { id: "straightBarDips", label: "➖", fullLabel: "Straight Bar Dips (2x6)", requires: ["benchDips"], position: { x: 0, y: 400 }, xp: 4 },
  { id: "koreanDips", label: "🇰🇷", fullLabel: "Korean Dips (2x5)", requires: ["straightBarDips"], position: { x: 0, y: 300 }, xp: 6 },
  { id: "ringDips", label: "💍", fullLabel: "Ring Dips (2x4)", requires: ["koreanDips"], position: { x: 0, y: 200 }, xp: 7 },
  { id: "weightedDips", label: "🏋️", fullLabel: "Weighted Dips (2x3)", requires: ["ringDips"], position: { x: 0, y: 100 }, xp: 9 },

  { id: "wallPike", label: "🪡", fullLabel: "Wall Pike PU (2x6)", position: { x: 120, y: 500 }, xp: 2 },
  { id: "pike", label: "🔺", fullLabel: "Pike Push-Ups (2x6)", requires: ["wallPike"], position: { x: 120, y: 400 }, xp: 3 },
  { id: "elevatedPike", label: "📦", fullLabel: "Elevated Pike PU (2x5)", requires: ["pike"], position: { x: 120, y: 300 }, xp: 5 },
  { id: "wallHandstand", label: "🧙‍♂️", fullLabel: "Wall HSPU (2x3)", requires: ["elevatedPike", "ringDips"], position: { x: 120, y: 200 }, xp: 7 },

  { id: "oneArmPushups", label: "👐", fullLabel: "One-Arm Push-Ups (2x3)", requires: ["archerPushups", "weightedDips"], position: { x: -60, y: 50 }, xp: 8 },
  { id: "freestanding", label: "🤸", fullLabel: "Freestanding HSPU (1–3)", requires: ["wallHandstand", "oneArmPushups"], position: { x: 60, y: 20 }, xp: 10 },
  { id: "ninetyPushup", label: "🔏", fullLabel: "90° Push-Up (2x2)", requires: ["freestanding", "oneArmPushups"], position: { x: 0, y: -50 }, xp: 12 },
];

export default function PushTree() {
  const unlocked = useSkillStore((state) => state.unlockedSkills.push);
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  const resetAll = useSkillStore((state) => state.resetAll);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);
  const category = "push";

  const generateFlowData = (skills, unlockedList) => {
    const nodes = skills.map((skill) => ({
      id: skill.id,
      type: "default",
      position: skill.position,
      draggable: false,
      data: { label: skill.label },
      style: {
        border: "2px solid #ffffff",
        background: unlockedList.includes(skill.id) ? "#3b82f6" : "#222",
        color: "white",
        padding: 6,
        borderRadius: 10,
        fontSize: 22,
        textAlign: "center",
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: unlockedList.includes(skill.id)
          ? "0 0 6px 1px rgba(255, 255, 255, 0.6)"
          : "0 0 2px 1px #222",
        transition: "all 0.3s ease",
        cursor: "pointer",
      },
    }));

    const edges = skills
      .filter((skill) => skill.requires)
      .flatMap((skill) =>
        skill.requires.map((req) => ({
          id: `${req}->${skill.id}`,
          source: req,
          target: skill.id,
          animated: false,
          style: { stroke: "#ffffff", strokeWidth: 2 },
        }))
      );

    return { nodes, edges };
  };

  useEffect(() => {
    const { nodes, edges } = generateFlowData(pushSkills, unlocked);
    setNodes(nodes);
    setEdges(edges);
  }, [unlocked]);

  const onInit = (instance) => {
    if (!initialized.current) {
      instance.zoomTo(1);
      initialized.current = true;
    }
  };

  const onNodeClick = useCallback((_, node) => {
    const skill = pushSkills.find((s) => s.id === node.id);
    if (!skill) return;

    if (unlocked.includes(skill.id)) {
      setTooltip(skill.fullLabel);
      setTimeout(() => setTooltip(null), 2000);
      return;
    }

    const prereqs = skill.requires || [];
    const lockedPrereqs = prereqs.filter((id) => !unlocked.includes(id));

    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = pushSkills.find((s) => s.id === id);
        return s?.fullLabel.replace(/\s*\([^)]*\)/, "") || id;
      });
      const currentSkillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
      alert(`To unlock "${currentSkillName}", you must first unlock:\n\n${names.join("\n")}`);
      return;
    }

    const fullNames = prereqs.map((id) => {
      const s = pushSkills.find((s) => s.id === id);
      return s?.fullLabel || id;
    });

    const confirmPrereqs = confirm(
      `To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${fullNames.join(
        "\n"
      )}\n\nCan you do all of these?`
    );

    if (!confirmPrereqs) return;

    unlockSkill(category, skill.id, skill.xp || 5);
  }, [unlocked, unlockSkill]);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%", background: "#000", position: "relative" }}>
        <button
          onClick={resetAll}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          Reset Tree
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onInit={onInit}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          panOnDrag={true}
          translateExtent={[[-10, -10000], [10, 10000]]}
          fitView
        >
          <Controls position="bottom-left" />
        </ReactFlow>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#222",
              color: "white",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 14,
              zIndex: 1000,
              boxShadow: "0 0 8px #000",
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
