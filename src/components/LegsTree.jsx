// LegsTree.jsx – Compact with popup and prereq logic
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const legSkills = [
  { id: "wallSit", label: "🧱", fullLabel: "Wall Sit (30s)", position: { x: -120, y: 500 }, xp: 2 },
  { id: "bodyweightSquat", label: "🏋️", fullLabel: "Bodyweight Squats (2x10)", requires: ["wallSit"], position: { x: -120, y: 400 }, xp: 2 },
  { id: "stepUps", label: "🪜", fullLabel: "Step-Ups (2x6 each leg)", requires: ["bodyweightSquat"], position: { x: -120, y: 300 }, xp: 3 },
  { id: "shrimpSquat", label: "🦐", fullLabel: "Shrimp Squat (2x3)", requires: ["stepUps"], position: { x: -120, y: 200 }, xp: 5 },

  { id: "jumpSquat", label: "⚡", fullLabel: "Jump Squats (2x6)", requires: ["bodyweightSquat"], position: { x: 0, y: 400 }, xp: 3 },
  { id: "broadJump", label: "🏃", fullLabel: "Broad Jump (2x3)", requires: ["jumpSquat"], position: { x: 0, y: 300 }, xp: 4 },

  { id: "pistolSquat", label: "🦵", fullLabel: "Pistol Squat (1x1 each leg)", requires: ["shrimpSquat"], position: { x: -60, y: 100 }, xp: 6 },
  { id: "dragonSquat", label: "🐉", fullLabel: "Dragon Squat (1x1 each leg)", requires: ["shrimpSquat", "broadJump"], position: { x: 60, y: 100 }, xp: 8 },
];

export default function LegsTree({ addXp }) {
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
    const { nodes, edges } = generateFlowData(legSkills, []);
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
    const skill = legSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

    const prereqs = skill.requires || [];
    const unmet = prereqs.filter((r) => !unlocked.includes(r));
    if (unmet.length > 0) {
      const unmetNames = unmet.map((id) => {
        const prereq = legSkills.find((s) => s.id === id);
        return prereq ? prereq.fullLabel : id;
      });
      alert(`To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${unmetNames.join("\n")}`);
      return;
    }

    if (unlocked.includes(skill.id)) return;

    const skillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
    const prereqId = (skill.requires && skill.requires[0]) || null;
    const prereqSkill = prereqId ? legSkills.find((s) => s.id === prereqId) : null;
    const prereqFull = prereqSkill ? prereqSkill.fullLabel : "a prerequisite skill";

    const confirmed = confirm(`To unlock "${skillName}", you must be able to do:\n\n${prereqFull}.\n\nProceed?`);
    if (confirmed) {
      const updated = [...unlocked, skill.id];
      setUnlocked(updated);
      addXp(skill.xp || 5);

      const flow = generateFlowData(legSkills, updated);
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
