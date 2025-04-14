import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSkillStore } from "../Stores/SkillStore";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "BT", nodesep: 60, ranksep: 80 });

const coreSkills = [
  { id: "deadBug", label: "🐞", fullLabel: "Dead Bug (2x20s)", requires: [], xp: 2 },
  { id: "hollowHold", label: "🫢", fullLabel: "Hollow Hold (2x20s)", requires: ["deadBug"], xp: 3 },
  { id: "hollowRocks", label: "🌊", fullLabel: "Hollow Rocks (2x10)", requires: ["hollowHold"], xp: 4 },

  { id: "lyingLegRaises", label: "🦵", fullLabel: "Lying Leg Raises (2x10)", requires: [], xp: 2 },
  { id: "hangingKneeRaises", label: "🦿", fullLabel: "Hanging Knee Raises (2x5)", requires: ["lyingLegRaises"], xp: 3 },
  { id: "hangingLegRaises", label: "🦖", fullLabel: "Hanging Leg Raises (2x5)", requires: ["hangingKneeRaises"], xp: 5 },
  { id: "lSit", label: "🪑", fullLabel: "L-Sit (10s)", requires: ["hangingLegRaises"], xp: 6 },

  { id: "vUps", label: "✅", fullLabel: "V-Ups (2x8)", requires: ["hollowRocks"], xp: 4 },
  { id: "vToL", label: "📐", fullLabel: "V to L Transition (2x3)", requires: ["vUps", "lSit"], xp: 8 },
];

export default function CoreTree() {
  const unlocked = useSkillStore((state) => state.unlockedSkills.core);
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  const resetAll = useSkillStore((state) => state.resetAll);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);
  const category = "core";

  const generateFlowData = (skills, unlockedList) => {
    dagreGraph.setGraph({ rankdir: "BT", nodesep: 60, ranksep: 80 });

    skills.forEach((skill) => {
      dagreGraph.setNode(skill.id, { width: 80, height: 80 });
    });

    skills.forEach((skill) => {
      if (skill.requires) {
        skill.requires.forEach((req) => {
          dagreGraph.setEdge(req, skill.id);
        });
      }
    });

    dagre.layout(dagreGraph);

    const nodes = skills.map((skill) => {
      const { x, y } = dagreGraph.node(skill.id);
      return {
        id: skill.id,
        type: "default",
        data: { label: skill.label },
        position: { x, y },
        draggable: false,
        sourcePosition: "top",
        targetPosition: "bottom",
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
      };
    });

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
    const { nodes, edges } = generateFlowData(coreSkills, unlocked);
    setNodes(nodes);
    setEdges(edges);
  }, [unlocked]);

  const onInit = (instance) => {
    if (!initialized.current) {
      setTimeout(() => instance.fitView({ padding: 0.2 }), 50);
      initialized.current = true;
    }
  };

  const onNodeClick = useCallback((_, node) => {
    const skill = coreSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

    const prereqs = skill.requires || [];
    const lockedPrereqs = prereqs.filter((id) => !unlocked.includes(id));

    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = coreSkills.find((s) => s.id === id);
        return s?.fullLabel.replace(/\s*\([^)]*\)/, "") || id;
      });
      const currentSkillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");
      alert(`To unlock "${currentSkillName}", you must first unlock:\n\n${names.join("\n")}`);
      return;
    }

    const fullNames = prereqs.map((id) => {
      const s = coreSkills.find((s) => s.id === id);
      return s?.fullLabel || id;
    });

    const confirmPrereqs = confirm(
      `To unlock "${skill.fullLabel.replace(/\s*\([^)]*\)/, "")}", you must be able to do:\n\n${fullNames.join(
        "\n"
      )}\n\nCan you do all of these?`
    );

    if (!confirmPrereqs || unlocked.includes(skill.id)) return;

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
          translateExtent={[[-10000, -10000], [10000, 10000]]}
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
