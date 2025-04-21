// Phase 3: Save and Load Workouts
import React, { useState, useEffect } from "react";

export default function SavedWorkouts({ onLoad }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("savedWorkouts");
    if (raw) setSaved(JSON.parse(raw));
  }, []);

  const deleteWorkout = (index) => {
    const updated = saved.filter((_, i) => i !== index);
    localStorage.setItem("savedWorkouts", JSON.stringify(updated));
    setSaved(updated);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">Saved Workouts</h2>
      {saved.length === 0 && (
        <p className="text-gray-400">No workouts saved yet.</p>
      )}
      {saved.map((w, i) => (
        <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-blue-400 font-semibold text-lg">{w.name}</h3>
              <p className="text-sm text-gray-400">{w.exercises.length} exercises</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onLoad(w)}
                className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Start
              </button>
              <button
                onClick={() => deleteWorkout(i)}
                className="text-sm px-2 py-1 bg-red-700 hover:bg-red-800 text-white rounded"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
