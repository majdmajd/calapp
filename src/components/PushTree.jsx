// PushTree.jsx – Compact layout with skill unlock logic for Push progression
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const pushSkills = [
  // Chest
  { id: "kneePushups", label: "🦵", fullLabel: "Knee Push-Ups (2x8)", position: { x: -120, y: 500 }, xp: 2 },
  { id: "inclinePushups", label: "📐", fullLabel: "Incline Push-Ups (2x8)", requires: ["kneePushups"], position: { x: -120, y: 400 }, xp: 3 },
  { id: "pushups", label: "🤜", fullLabel: "Push-Ups (2x8)", requires: ["inclinePushups"], position: { x: -120, y: 300 }, xp: 4 },
  { id: "archerPushups", label: "🏹", fullLabel: "Archer Push-Ups (2x6)", requires: ["pushups"], position: { x: -120, y: 200 }, xp: 6 },

  // Triceps
  { id: "benchDips", label: "🪑", fullLabel: "Bench Dips (2x10)", position: { x: 0, y: 500 }, xp: 2 },
  { id: "straightBarDips", label: "➖", fullLabel: "Straight Bar Dips (2x6)", requires: ["benchDips"], position: { x: 0, y: 400 }, xp: 4 },
  { id: "koreanDips", label: "🇰🇷", fullLabel: "Korean Dips (2x5)", requires: ["straightBarDips"], position: { x: 0, y: 300 }, xp: 6 },
  { id: "ringDips", label: "💍", fullLabel: "Ring Dips (2x4)", requires: ["koreanDips"], position: { x: 0, y: 200 }, xp: 7 },
  { id: "weightedDips", label: "🏋️", fullLabel: "Weighted Dips (2x3)", requires: ["ringDips"], position: { x: 0, y: 100 }, xp: 9 },

  // Shoulders
  { id: "wallPike", label: "🧱", fullLabel: "Wall Pike PU (2x6)", position: { x: 120, y: 500 }, xp: 2 },
  { id: "pike", label: "🔺", fullLabel: "Pike Push-Ups (2x6)", requires: ["wallPike"], position: { x: 120, y: 400 }, xp: 3 },
  { id: "elevatedPike", label: "📦", fullLabel: "Elevated Pike PU (2x5)", requires: ["pike"], position: { x: 120, y: 300 }, xp: 5 },
  { id: "wallHandstand", label: "🧍‍♂️", fullLabel: "Wall HSPU (2x3)", requires: ["elevatedPike", "ringDips"], position: { x: 120, y: 200 }, xp: 7 },

  // Combined advanced skills
  { id: "oneArmPushups", label: "🖐️", fullLabel: "One-Arm Push-Ups (2x3)", requires: ["archerPushups", "weightedDips"], position: { x: -60, y: 50 }, xp: 8 },
  { id: "freestanding", label: "🤸", fullLabel: "Freestanding HSPU (1–3)", requires: ["wallHandstand", "oneArmPushups"], position: { x: 60, y: 20 }, xp: 10 },
  { id: "ninetyPushup", label: "💯", fullLabel: "90° Push-Up (2x2)", requires: ["freestanding", "oneArmPushups"], position: { x: 0, y: -50 }, xp: 12 },
];

export default function PushTree({ addXp }) {
  const [unlocked, setUnlocked] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);

  const generateFlowData = (skills, unlockedList) => {
    const nodes = skills.map((skill) => ({
      id: skill.id,
      type: "default",
      position: skill.position,
      draggable: false,
      data: { label: skill.label },
      style: {
        border: unlockedList.includes(skill.id) ? "2px solid #22c55e" : "2px solid #ffffff",
        background: unlockedList.includes(skill.id) ? "#3b82f6" : "#444",
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
    const { nodes, edges } = generateFlowData(pushSkills, []);
    setNodes(nodes);
    setEdges(edges);
  }, []);

  const onInit = (instance) => {
    if (!initialized.current) {
      instance.zoomTo(1);
      initialized.current = true;
    }
  };

  const onNodeClick = useCallback((_, node) => {
    const skill = pushSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

    const prereqs = skill.requires || [];
    const unmet = prereqs.filter((r) => !unlocked.includes(r));
    if (unmet.length > 0) {
      const unmetNames = unmet.map((id) => {
        const prereq = pushSkills.find((s) => s.id === id);
        return prereq ? prereq.fullLabel : id;
      });
      alert(`To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${unmetNames.join("\n")}`);
      return;
    }

    if (unlocked.includes(skill.id)) return;

    const skillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
    const prereqId = (skill.requires && skill.requires[0]) || null;
    const prereqSkill = prereqId ? pushSkills.find((s) => s.id === prereqId) : null;
    const prereqFull = prereqSkill ? prereqSkill.fullLabel : "a prerequisite skill";

    const confirmed = confirm(`To unlock "${skillName}", you must be able to do:\n\n${prereqFull}.\n\nProceed?`);
    if (confirmed) {
      const updated = [...unlocked, skill.id];
      setUnlocked(updated);
      addXp(skill.xp || 5);

      const flow = generateFlowData(pushSkills, updated);
      setNodes(flow.nodes);
      setEdges(flow.edges);
    }
  }, [unlocked]);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%", background: "#000", position: "relative" }}>
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
          <Background color="#1e1e1e" gap={16} />
        </ReactFlow>
        {tooltip && (
          <div style={{
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
          }}>
            {tooltip}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
