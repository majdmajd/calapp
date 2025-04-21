import React, { useState, useEffect } from "react";
import ExerciseSelectorModal from "../components/ExerciseSelectorModal";
import SavedWorkouts from "../components/SavedWorkouts";

export default function WorkoutTracker() {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isLiveWorkout, setIsLiveWorkout] = useState(false);

  const addExercises = (newExercises) => {
    const mapped = newExercises.map((ex) => ({
      ...ex,
      notes: "",
      rest: false,
      sets: [{ reps: "" }],
    }));
    setExercises((prev) => [...prev, ...mapped]);
    setShowModal(false);
  };

  const updateSet = (exIndex, setIndex, value) => {
    const copy = [...exercises];
    copy[exIndex].sets[setIndex].reps = value;
    setExercises(copy);
  };

  const addSet = (exIndex) => {
    const copy = [...exercises];
    copy[exIndex].sets.push({ reps: "" });
    setExercises(copy);
  };

  const toggleRest = (exIndex) => {
    const copy = [...exercises];
    copy[exIndex].rest = !copy[exIndex].rest;
    setExercises(copy);
  };

  const updateNotes = (exIndex, value) => {
    const copy = [...exercises];
    copy[exIndex].notes = value;
    setExercises(copy);
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) return;
    const existing = JSON.parse(localStorage.getItem("savedWorkouts") || "[]");
    const newWorkout = { name: workoutName, exercises };
    localStorage.setItem("savedWorkouts", JSON.stringify([...existing, newWorkout]));
    setWorkoutName("");
    setShowSavePrompt(false);
    setExercises([]);
    setReloadKey((k) => k + 1);
  };

  const loadWorkout = (workout) => {
    setExercises(workout.exercises);
    setIsLiveWorkout(true);
  };

  const completeWorkout = () => {
    setExercises([]);
    setIsLiveWorkout(false);
    setReloadKey((k) => k + 1);
};

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">Workout Tracker</h1>

      {exercises.map((ex, exIndex) => (
        <div
          key={exIndex}
          className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="text-blue-400 font-bold text-lg">
              <span className="mr-2 text-xl">{ex.emoji}</span>
              {ex.name}
            </div>
            <button
              onClick={() => toggleRest(exIndex)}
              className={`text-sm px-3 py-1 rounded-full border transition ${
                ex.rest
                  ? "bg-blue-700 border-blue-500"
                  : "bg-gray-800 border-gray-600"
              }`}
            >
              {ex.rest ? "Rest: ON" : "Rest: OFF"}
            </button>
          </div>

          <textarea
            placeholder="Notes..."
            value={ex.notes}
            onChange={(e) => updateNotes(exIndex, e.target.value)}
            className="w-full p-2 text-sm bg-gray-800 border border-gray-700 rounded resize-none text-white"
          />

          <div className="space-y-2">
            {ex.sets.map((set, setIndex) => (
              <div key={setIndex} className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Set {setIndex + 1}</span>
                <input
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(exIndex, setIndex, e.target.value)}
                  className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => addSet(exIndex)}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            + Add Set
          </button>
        </div>
      ))}

      <div className="flex justify-center gap-4 mb-4">
        {!isLiveWorkout && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            + Create Workout
          </button>
        )}
        {exercises.length > 0 && !isLiveWorkout && (
          <button
            onClick={() => setShowSavePrompt(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
          >
            💾 Save Workout
          </button>
        )}
        {exercises.length > 0 && isLiveWorkout && (
          <button
            onClick={completeWorkout}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
          >
            ✅ Complete Workout
          </button>
        )}
      </div>

      <SavedWorkouts key={reloadKey} onLoad={loadWorkout} />

      {showModal && (
        <ExerciseSelectorModal
          onClose={() => setShowModal(false)}
          onAdd={addExercises}
        />
      )}

      {showSavePrompt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Name this workout</h2>
            <input
              type="text"
              placeholder="e.g. Push Day A"
              className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSavePrompt(false)}
                className="px-3 py-1 text-sm bg-gray-700 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkout}
                className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
