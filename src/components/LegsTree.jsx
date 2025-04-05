import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSkillStore } from "../Stores/SkillStore"; // ✅

const legSkills = [
  { id: "gluteBridge", label: "🌉", fullLabel: "Glute Bridge (2x12)", position: { x: -100, y: 500 }, xp: 2 },
  { id: "wallSit", label: "🧱", fullLabel: "Wall Sit (2x30s)", position: { x: 0, y: 500 }, xp: 2 },
  { id: "stepUps", label: "🪜", fullLabel: "Step-Ups (2x10)", requires: ["gluteBridge"], position: { x: -100, y: 400 }, xp: 3 },
  { id: "lunges", label: "🦵", fullLabel: "Lunges (2x8)", requires: ["stepUps"], position: { x: -100, y: 300 }, xp: 4 },
  { id: "shrimpSquat", label: "🦐", fullLabel: "Shrimp Squat (2x5)", requires: ["lunges"], position: { x: -100, y: 200 }, xp: 6 },
  { id: "pistolSquat", label: "🔫", fullLabel: "Pistol Squat (2x3)", requires: ["shrimpSquat"], position: { x: -100, y: 100 }, xp: 8 },
  { id: "wallSitPulse", label: "🔁", fullLabel: "Wall Sit Pulses (2x10)", requires: ["wallSit"], position: { x: 0, y: 400 }, xp: 3 },
  { id: "splitSquat", label: "🪞", fullLabel: "Split Squat (2x8)", requires: ["wallSitPulse"], position: { x: 0, y: 300 }, xp: 5 },
  { id: "jumpLunge", label: "🦘", fullLabel: "Jump Lunge (2x6)", requires: ["splitSquat"], position: { x: 0, y: 200 }, xp: 7 },
];

export default function LegsTree() {
  const unlocked = useSkillStore((state) => state.unlockedSkills.legs);
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  const resetAll = useSkillStore((state) => state.resetAll);

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
    const { nodes, edges } = generateFlowData(legSkills, unlocked);
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
    const skill = legSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

    const prereqs = skill.requires || [];
    const lockedPrereqs = prereqs.filter((id) => !unlocked.includes(id));

    // Case 2: If prerequisites are locked
    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = legSkills.find((s) => s.id === id);
        return s?.fullLabel.replace(/\s*\([^)]*\)/, "") || id;
      });
      const currentSkillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
      alert(`To unlock "${currentSkillName}", you must first unlock:\n\n${names.join("\n")}`);
      return;
    }

    // Case 1: Prereqs unlocked → ask if user can meet the requirement
    const fullNames = prereqs.map((id) => {
      const s = legSkills.find((s) => s.id === id);
      return s?.fullLabel || id;
    });

    const confirmPrereqs = confirm(
      `To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${fullNames.join(
        "\n"
      )}\n\nCan you do all of these?`
    );

    if (!confirmPrereqs) return;

    if (unlocked.includes(skill.id)) return;

    unlockSkill("legs", skill.id, skill.xp || 5);
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
          <Background color="#1e1e1e" gap={16} />
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
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
