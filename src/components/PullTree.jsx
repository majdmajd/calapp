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

const pullSkills = [
  { id: "deadHang", label: "🪢", fullLabel: "Dead Hang (30s)", xp: 2 },
  { id: "scapularPulls", label: "⬇️", fullLabel: "Scapular Pulls (2x6)", requires: ["deadHang"], xp: 2 },
  { id: "negativePullups", label: "🔻", fullLabel: "Negative Pull-Ups (2x5)", requires: ["scapularPulls"], xp: 3 },
  { id: "pullups", label: "🧱", fullLabel: "Pull-Ups (2x5)", requires: ["negativePullups"], xp: 4 },

  { id: "archer", label: "🌹", fullLabel: "Archer Pull-Ups (2x3)", requires: ["pullups"], xp: 5 },
  { id: "typewriter", label: "↔️", fullLabel: "Typewriter Pull-Ups (2x3)", requires: ["archer"], xp: 6 },
  { id: "oneArmHold", label: "🖐️", fullLabel: "One-Arm Hold (10s)", requires: ["typewriter"], xp: 7 },
  { id: "oneArmPull", label: "💪", fullLabel: "One-Arm Pull-Up (1x1)", requires: ["oneArmHold"], xp: 10 },

  { id: "explosivePullups", label: "⚡", fullLabel: "Explosive Pull-Ups (2x3)", requires: ["pullups"], xp: 5 },
  { id: "muscleup", label: "🚀", fullLabel: "Muscle-Up (1x1)", requires: ["explosivePullups"], xp: 9 },

  { id: "skinTheCat", label: "🐱", fullLabel: "Skin the Cat (2x3)", requires: ["scapularPulls"], xp: 3 },
  { id: "tuckBack", label: "🦴", fullLabel: "Tuck Back Lever (10s)", requires: ["skinTheCat"], xp: 3 },
  { id: "advTuckBack", label: "🦴", fullLabel: "Adv. Tuck Back Lever (10s)", requires: ["tuckBack"], xp: 4 },
  { id: "halfLayBack", label: "🦴", fullLabel: "Half Lay Back Lever (10s)", requires: ["advTuckBack"], xp: 5 },
  { id: "openHalfBack", label: "🦴", fullLabel: "Open Half Lay Back Lever (10s)", requires: ["halfLayBack"], xp: 6 },
  { id: "straddleBack", label: "🦴", fullLabel: "Straddle Back Lever (10s)", requires: ["openHalfBack"], xp: 7 },
  { id: "fullBack", label: "🦴", fullLabel: "Full Back Lever (10s)", requires: ["straddleBack"], xp: 9 },

  { id: "tuckFront", label: "🌪", fullLabel: "Tuck Front Lever (10s)", requires: ["pullups"], xp: 3 },
  { id: "advTuckFront", label: "🌪", fullLabel: "Adv. Tuck Front Lever (10s)", requires: ["tuckFront"], xp: 4 },
  { id: "halfLayFront", label: "🌪", fullLabel: "Half Lay Front Lever (10s)", requires: ["advTuckFront"], xp: 5 },
  { id: "straddleFront", label: "🌪", fullLabel: "Straddle Front Lever (10s)", requires: ["halfLayFront"], xp: 7 },
  { id: "fullFront", label: "🌪", fullLabel: "Full Front Lever (10s)", requires: ["straddleFront"], xp: 9 },
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
    const { nodes, edges } = generateFlowData(pullSkills, unlocked);
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
    const skill = pullSkills.find((s) => s.id === node.id);
    if (!skill) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);

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

    const fullNames = prereqs.map((id) => {
      const s = pullSkills.find((s) => s.id === id);
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
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
