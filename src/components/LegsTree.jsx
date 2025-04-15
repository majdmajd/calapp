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
import CustomModal from "./CustomModal";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "BT", nodesep: 60, ranksep: 80 });

const legSkills = [
  { id: "gluteBridge", label: "🌉", fullLabel: "Glute Bridge (2x12)", xp: 2 },
  { id: "wallSit", label: "🧱", fullLabel: "Wall Sit (2x30s)", xp: 2 },
  { id: "stepUps", label: "🪜", fullLabel: "Step-Ups (2x10)", requires: ["gluteBridge"], xp: 3 },
  { id: "lunges", label: "🦵", fullLabel: "Lunges (2x8)", requires: ["stepUps"], xp: 4 },
  { id: "shrimpSquat", label: "🦐", fullLabel: "Shrimp Squat (2x5)", requires: ["lunges"], xp: 6 },
  { id: "pistolSquat", label: "🔫", fullLabel: "Pistol Squat (2x3)", requires: ["shrimpSquat"], xp: 8 },
  { id: "wallSitPulse", label: "🔁", fullLabel: "Wall Sit Pulses (2x10)", requires: ["wallSit"], xp: 3 },
  { id: "splitSquat", label: "🪞", fullLabel: "Split Squat (2x8)", requires: ["wallSitPulse"], xp: 5 },
  { id: "jumpLunge", label: "🦘", fullLabel: "Jump Lunge (2x6)", requires: ["splitSquat"], xp: 7 },
];

export default function LegsTree() {
  const unlocked = useSkillStore((state) => state.unlockedSkills.legs);
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
  
  // Manual implementation for resetting just the legs category
  const resetLegsOnly = () => {
    const currentState = useSkillStore.getState();
    useSkillStore.setState({
      ...currentState,
      xpData: {
        ...currentState.xpData,
        legs: 0
      },
      unlockedSkills: {
        ...currentState.unlockedSkills,
        legs: []
      }
    });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tooltip, setTooltip] = useState(null);
  const initialized = useRef(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const category = "legs";

  const isLockedPath = (skill) => {
    // Always show the base skills (no prerequisites)
    if (!skill.requires || skill.requires.length === 0) return false;
    if (unlocked.includes(skill.id)) return false;
    return !skill.requires.every((req) => unlocked.includes(req));
  };

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
      const isUnlocked = unlockedList.includes(skill.id);
      const isBaseSkill = !skill.requires || skill.requires.length === 0;
      const canUnlock = !isUnlocked && skill.requires?.every((req) => unlockedList.includes(req));

      let filter = "none";
      let opacity = 1;
      let border = "2px solid #ffffff";
      let labelText = skill.label;

      if (isUnlocked) {
        border = "2px solid #22c55e";
        filter = "none";
        opacity = 1;
      } else if (isBaseSkill) {
        border = "2px solid #ffffff";
        filter = "none";
        opacity = 1;
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
        data: { label: skill.label },
        position: { x, y },
        draggable: false,
        sourcePosition: "top",
        targetPosition: "bottom",
        style: {
          border,
          background: isUnlocked ? "#3b82f6" : canUnlock ? "#555" : "#222",
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

  useEffect(() => {
    const { nodes, edges } = generateFlowData(legSkills, unlocked);
    setNodes(nodes);
    setEdges(edges);
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
    const skill = legSkills.find((s) => s.id === node.id);
    if (!skill || unlocked.includes(skill.id)) return;

    setTooltip(skill.fullLabel);
    setTimeout(() => setTooltip(null), 2000);
    setSelectedSkill(skill);

    const prereqs = skill.requires || [];
    const lockedPrereqs = prereqs.filter((id) => !unlocked.includes(id));

    const skillName = skill.fullLabel.replace(/\s*\([^)]*\)/, "");

    if (lockedPrereqs.length > 0) {
      const names = lockedPrereqs.map((id) => {
        const s = legSkills.find((s) => s.id === id);
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
      const s = legSkills.find((s) => s.id === id);
      return s?.fullLabel || id;
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
    
  }, [unlocked, unlockSkill]);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%", background: "#000", position: "relative" }}>
        <button
          onClick={resetLegsOnly}
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
          Reset Legs Tree
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