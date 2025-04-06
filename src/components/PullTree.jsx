import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSkillStore } from "../Stores/SkillStore";
import { MoveVertical } from "lucide-react";

const pullSkills = [
  { id: "deadHang", label: "🪢", fullLabel: "Dead Hang (30s)", position: { x: -120, y: 500 }, xp: 2 },
  { id: "scapularPulls", label: "⬇️", fullLabel: "Scapular Pulls (2x6)", requires: ["deadHang"], position: { x: -120, y: 400 }, xp: 2 },
  { id: "negativePullups", label: "🔻", fullLabel: "Negative Pull-Ups (2x5)", requires: ["scapularPulls"], position: { x: -120, y: 300 }, xp: 3 },
  {
    id: "pullups",
    label: <MoveVertical size={28} strokeWidth={2} color="white" />,
    fullLabel: "Pull-Ups (2x5)",
    requires: ["negativePullups"],
    position: { x: -120, y: 200 },
    xp: 4
  },
  { id: "archer", label: "🏹", fullLabel: "Archer Pull-Ups (2x3)", requires: ["pullups"], position: { x: -60, y: 100 }, xp: 6 },
  { id: "typewriter", label: "↔️", fullLabel: "Typewriter Pull-Ups (2x3)", requires: ["archer"], position: { x: -60, y: 0 }, xp: 7 },
  { id: "oneArmHold", label: "🖐️", fullLabel: "One-Arm Hold (10s)", requires: ["typewriter"], position: { x: 0, y: -80 }, xp: 8 },
  { id: "oneArmPull", label: "💪", fullLabel: "One-Arm Pull-Up (1x1)", requires: ["oneArmHold"], position: { x: 0, y: -160 }, xp: 10 },
  { id: "explosivePullups", label: "⚡", fullLabel: "Explosive Pull-Ups (2x3)", requires: ["pullups"], position: { x: 60, y: 100 }, xp: 5 },
  { id: "muscleup", label: "🚀", fullLabel: "Muscle-Up (1x1)", requires: ["explosivePullups", "typewriter"], position: { x: 0, y: -240 }, xp: 12 },
];

export default function PullTree() {
  const unlocked = useSkillStore((state) => state.unlockedSkills.pull);
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  const resetAll = useSkillStore((state) => state.resetAll);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);

  const category = "pull";

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
    const { nodes, edges } = generateFlowData(pullSkills, unlocked);
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
    const skill = pullSkills.find((s) => s.id === node.id);
    if (!skill) return;

    // CASE 0: Already unlocked → show tooltip only
    if (unlocked.includes(skill.id)) {
      setTooltip(skill.fullLabel);
      setTimeout(() => setTooltip(null), 2000);
      return;
    }

    // CASE 1: Prerequisites not yet unlocked → show missing names
    const prereqs = skill.requires || [];
    const lockedPrereqs = prereqs.filter((id) => !unlocked.includes(id));

    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = pullSkills.find((s) => s.id === id);
        return s?.fullLabel.replace(/\s*\([^)]*\)/, "") || id;
      });
      const currentSkillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
      alert(`To unlock "${currentSkillName}", you must first unlock:\n\n${names.join("\n")}`);
      return;
    }

    // CASE 2: All prereqs unlocked → ask for rep/set confirmation
    const fullNames = prereqs.map((id) => {
      const s = pullSkills.find((s) => s.id === id);
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
