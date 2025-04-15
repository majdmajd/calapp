import React from "react";

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      {/* Card */}
      <div className="bg-blue-600/10 border border-blue-500/40 rounded-xl p-4 shadow-md">
        <h2 className="text-xl font-semibold text-blue-400">Tailwind Test Card</h2>
        <p className="text-white/80 mt-2">This is a test card styled with Tailwind CSS.</p>
      </div>

      {/* Button */}
      <button className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition">
        Click Me
      </button>

      {/* Skill Node */}
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl shadow-md">
        💪
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {["XP", "Level", "Unlocked", "Streak"].map((label, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 p-4 rounded-lg text-center"
          >
            <div className="text-xs text-white/50 uppercase">{label}</div>
            <div className="text-lg font-bold text-blue-400 mt-1">{Math.floor(Math.random() * 100)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
