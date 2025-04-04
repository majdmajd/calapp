// CoreTree.jsx – Compact with popup and prereq logic
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const coreSkills = [
  // Hollow hold branch
  { id: "deadBug", label: "🐞", fullLabel: "Dead Bug (2x20s)", position: { x: -120, y: 500 }, xp: 2 },
  { id: "hollowHold", label: "🥚", fullLabel: "Hollow Hold (2x20s)", requires: ["deadBug"], position: { x: -120, y: 400 }, xp: 3 },
  { id: "hollowRocks", label: "🌊", fullLabel: "Hollow Rocks (2x10)", requires: ["hollowHold"], position: { x: -120, y: 300 }, xp: 4 },

  // Leg raise branch
  { id: "lyingLegRaises", label: "🦵", fullLabel: "Lying Leg Raises (2x10)", position: { x: 0, y: 500 }, xp: 2 },
  { id: "hangingKneeRaises", label: "🦿", fullLabel: "Hanging Knee Raises (2x5)", requires: ["lyingLegRaises"], position: { x: 0, y: 400 }, xp: 3 },
  { id: "hangingLegRaises", label: "🦖", fullLabel: "Hanging Leg Raises (2x5)", requires: ["hangingKneeRaises"], position: { x: 0, y: 300 }, xp: 5 },
  { id: "lSit", label: "🪑", fullLabel: "L-Sit (10s)", requires: ["hangingLegRaises"], position: { x: 0, y: 200 }, xp: 6 },

  // V-up and advanced path
  { id: "vUps", label: "✅", fullLabel: "V-Ups (2x8)", requires: ["hollowRocks"], position: { x: -60, y: 200 }, xp: 4 },
  { id: "vToL", label: "📐", fullLabel: "V to L Transition (2x3)", requires: ["vUps", "lSit"], position: { x: -30, y: 100 }, xp: 8 },
];

export default function CoreTree({ addXp }) {
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
    const { nodes, edges } = generateFlowData(coreSkills, []);
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
    const skill = coreSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

    const prereqs = skill.requires || [];
    const unmet = prereqs.filter((r) => !unlocked.includes(r));
    if (unmet.length > 0) {
      const unmetNames = unmet.map((id) => {
        const prereq = coreSkills.find((s) => s.id === id);
        return prereq ? prereq.fullLabel : id;
      });
      alert(`To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${unmetNames.join("\n")}`);
      return;
    }

    if (unlocked.includes(skill.id)) return;

    const skillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
    const prereqId = (skill.requires && skill.requires[0]) || null;
    const prereqSkill = prereqId ? coreSkills.find((s) => s.id === prereqId) : null;
    const prereqFull = prereqSkill ? prereqSkill.fullLabel : "a prerequisite skill";

    const confirmed = confirm(`To unlock "${skillName}", you must be able to do:\n\n${prereqFull}.\n\nProceed?`);
    if (confirmed) {
      const updated = [...unlocked, skill.id];
      setUnlocked(updated);
      addXp(skill.xp || 5);

      const flow = generateFlowData(coreSkills, updated);
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
