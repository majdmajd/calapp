import React, { useState } from "react";

const EXERCISES = [
  { id: "pushups", name: "Push-Ups", emoji: "🡜", category: "push" },
  { id: "pullups", name: "Pull-Ups", emoji: "🧱", category: "pull" },
  { id: "pike", name: "Pike Push-Up", emoji: "🔺", category: "push" },
  { id: "hangingLegRaise", name: "Hanging Leg Raise", emoji: "🦖", category: "core" },
  { id: "gluteBridge", name: "Glute Bridge", emoji: "🌉", category: "legs" },
];

export default function ExerciseSelectorModal({ onClose, onAdd }) {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const toggleExercise = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = EXERCISES.filter((ex) => {
    const matchesFilter = filter === "all" || ex.category === filter;
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-[999] p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Select Exercises</h2>
        <button className="text-blue-500" onClick={onClose}>Cancel</button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        {["all", "push", "pull", "core", "legs"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === cat ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
              selected.includes(ex.id)
                ? "bg-blue-700 border-blue-500"
                : "bg-gray-900 border-gray-700"
            }`}
            onClick={() => toggleExercise(ex.id)}
          >
            <span className="text-white text-sm">
              <span className="mr-2 text-xl">{ex.emoji}</span>
              {ex.name}
            </span>
            {selected.includes(ex.id) && <span className="text-blue-300">✓</span>}
          </div>
        ))}
      </div>

      <button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center"
        onClick={() => {
          const selectedExercises = EXERCISES.filter((ex) => selected.includes(ex.id));
          onAdd(selectedExercises);
        }}
      >
        Add {selected.length} Exercise{selected.length !== 1 ? "s" : ""}
      </button>
    </div>
  );
}
