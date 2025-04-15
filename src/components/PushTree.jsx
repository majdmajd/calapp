
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSkillStore } from "../Stores/SkillStore";
import dagre from "dagre";
import CustomModal from "./CustomModal";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "BT", nodesep: 60, ranksep: 80 });

const pushSkills = [
  // 🔹 Beginner path
  { id: "kneePushups", label: "🦵", fullLabel: "Knee Push-Ups (2x8)", xp: 2 },
  { id: "inclinePushups", label: "📀", fullLabel: "Incline Push-Ups (2x8)", requires: ["kneePushups"], xp: 3 },
  { id: "pushups", label: "🡜", fullLabel: "Push-Ups (2x8)", requires: ["inclinePushups"], xp: 4 },

  // 🔴 Chest
  { id: "archerPushups", label: "🌽", fullLabel: "Archer Push-Ups (2x6)", requires: ["pushups"], xp: 6 },
  { id: "oneArmPushups", label: "👐", fullLabel: "One-Arm Push-Ups (2x3)", requires: ["archerPushups"], xp: 8 },
  { id: "ninetyPushup", label: "🔏", fullLabel: "90° Push-Up (2x2)", requires: ["oneArmPushups"], xp: 12 },

  // 🟠 Triceps
  { id: "benchDips", label: "🪑", fullLabel: "Bench Dips (2x10)", requires: ["pushups"], xp: 2 },
  { id: "straightBarDips", label: "➖", fullLabel: "Straight Bar Dips (2x6)", requires: ["benchDips"], xp: 4 },
  { id: "koreanDips", label: "🇰🇷", fullLabel: "Korean Dips (2x5)", requires: ["straightBarDips"], xp: 6 },
  { id: "ringDips", label: "💍", fullLabel: "Ring Dips (2x4)", requires: ["koreanDips"], xp: 7 },
  { id: "weightedDips", label: "🏋️", fullLabel: "Weighted Dips (2x3)", requires: ["ringDips"], xp: 9 },

  // 🟡 Shoulders
  { id: "wallPike", label: "🪡", fullLabel: "Wall Pike PU (2x6)", requires: ["pushups"], xp: 2 },
  { id: "pike", label: "🔺", fullLabel: "Pike Push-Ups (2x6)", requires: ["wallPike"], xp: 3 },
  { id: "elevatedPike", label: "📦", fullLabel: "Elevated Pike PU (2x5)", requires: ["pike"], xp: 5 },
  { id: "wallHandstand", label: "🧙‍♂️", fullLabel: "Wall HSPU (2x3)", requires: ["elevatedPike"], xp: 7 },
  { id: "freestanding", label: "🤸", fullLabel: "Freestanding HSPU (1–3)", requires: ["wallHandstand"], xp: 10 },

  // 🟢 Explosive
  { id: "clappingPushups", label: "👏", fullLabel: "Clapping Push-Ups (2x5)", requires: ["pushups"], xp: 5 },

  // 🔵 Planche (Isometric)
  { id: "plancheLean", label: "🫳", fullLabel: "Planche Lean (20s)", requires: ["pushups"], xp: 3 },
  { id: "tuckPlanche", label: "🥚", fullLabel: "Tuck Planche (10s)", requires: ["plancheLean"], xp: 5 },
  { id: "advTuckPlanche", label: "🐣", fullLabel: "Advanced Tuck Planche (10s)", requires: ["tuckPlanche"], xp: 6 },
  { id: "straddlePlanche", label: "🪂", fullLabel: "Straddle Planche (10s)", requires: ["advTuckPlanche"], xp: 8 },
  { id: "fullPlanche", label: "🦅", fullLabel: "Full Planche (10s)", requires: ["straddlePlanche"], xp: 10 },
];

const generateFlowData = (skills, unlockedList) => {
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
    const layoutNode = dagreGraph.node(skill.id);
    const x = layoutNode.x;
    const y = layoutNode.y;
    const isUnlocked = unlockedList.includes(skill.id);
    const isBaseSkill = !skill.requires || skill.requires.length === 0;
    const canUnlock = !isUnlocked && skill.requires?.every((r) => unlockedList.includes(r));

    let filter = "none";
    let opacity = 1;
    let border = "2px solid #ffffff";
    let labelText = skill.label;

    if (isUnlocked) {
      border = "2px solid #22c55e";
    } else if (isBaseSkill) {
      border = "2px solid #ffffff";
    } else if (canUnlock) {
      border = "2px dashed #facc15";
      opacity = 0.85;
    } else {
      filter = "blur(2px)";
      opacity = 0.4;
    }

    return {
      id: skill.id,
      type: "default",
      data: { label: labelText },
      position: { x, y },
      draggable: false,
      sourcePosition: "top",
      targetPosition: "bottom",
      style: {
        border,
        background: isUnlocked ? "#3b82f6" : canUnlock ? "#444" : "#222",
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
        filter,
        opacity,
        boxShadow: canUnlock ? "0 0 18px 4px #38bdf8" : "none",
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
        style: { 
          stroke: "#ffffff", 
          strokeWidth: 2,
          opacity: nodes.find(n => n.id === skill.id).style.opacity,
          filter: nodes.find(n => n.id === skill.id).style.filter
        },
      }))
    );

  return { nodes, edges };
};

export default function PushTree() {
  // Get everything from the store
  const unlockedSkills = useSkillStore((state) => state.unlockedSkills);
  const unlocked = unlockedSkills.push;
  const unlockSkill = useSkillStore((state) => state.unlockSkill);
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    showCancel: true,
    confirmText: "Unlock",
    cancelText: "Not Yet"
  });
  
  // Manual implementation for resetting just the push category
  const resetPushOnly = () => {
    const currentState = useSkillStore.getState();
    useSkillStore.setState({
      ...currentState,
      xpData: {
        ...currentState.xpData,
        push: 0
      },
      unlockedSkills: {
        ...currentState.unlockedSkills,
        push: []
      }
    });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const category = "push";

  useEffect(() => {
    (async () => {
      const { nodes, edges } = generateFlowData(pushSkills, unlocked);
      setNodes(nodes);
      setEdges(edges);
    })();
  }, [unlocked]);

  const onInit = (instance) => {
    if (!initialized.current) {
      setTimeout(() => instance.fitView({ padding: 0.2 }), 50);
      initialized.current = true;
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    setSelectedSkill(null);
  };

  const onNodeClick = useCallback((_, node) => {
    const skill = pushSkills.find((s) => s.id === node.id);
    if (!skill || unlocked.includes(skill.id)) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);
    setSelectedSkill(skill);

    const prereqs = skill.requires || [];
    const allUnlocked = Object.values(unlockedSkills).flat();
    const lockedPrereqs = prereqs.filter((id) => !allUnlocked.includes(id));

    const skillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");

    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = pushSkills.find((s) => s.id === id);
        return s?.fullLabel.replace(/\s*\([^)]*\)/, "") || id;
      });
      
      // Show missing prerequisites modal
      setModalState({
        isOpen: true,
        title: `Prerequisites Missing`,
        message: [
          `To unlock "${skillName}", you must first unlock:`,
          ...names
        ],
        onConfirm: closeModal,
        showCancel: false,
        confirmText: "Got it"
      });
      return;
    }

    const fullNames = prereqs.map((id) => {
      const s = pushSkills.find((s) => s.id === id);
      return s?.fullLabel || `Unknown skill: ${id}`;
    });

    // Show confirmation modal
    setModalState({
      isOpen: true,
      title: `Unlock ${skillName}?`,
      message: [
        `To unlock "${skillName}", you must be able to do:`,
        ...fullNames.map(name => name.replace(/\s*\([^)]*\)/, "")),
        `Can you do all of these?`
      ],
      onConfirm: () => {
        unlockSkill(category, skill.id, skill.xp || 5);
        closeModal();
      },
      showCancel: true,
      confirmText: "Unlock",
      cancelText: "Not Yet"
    });
    
  }, [unlocked, unlockSkill, unlockedSkills]);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%", background: "#000", position: "relative" }}>
        <button
          onClick={resetPushOnly}
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
          Reset Push Tree
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
        
        {/* Custom Modal */}
        <CustomModal
          isOpen={modalState.isOpen}
          title={modalState.title}
          message={modalState.message}
          onConfirm={modalState.onConfirm}
          onCancel={closeModal}
          showCancel={modalState.showCancel}
          confirmText={modalState.confirmText}
          cancelText={modalState.cancelText}
        />
      </div>
    </ReactFlowProvider>
  );
}
