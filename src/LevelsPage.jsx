// LevelsPage.jsx – XP tracking and pie chart visualization
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function LevelsPage({ xpData }) {
  const categories = ["push", "pull", "core", "legs"];
  const pieData = categories.map((key, i) => ({
    name: key.toUpperCase(),
    value: xpData[key] || 0,
    color: COLORS[i % COLORS.length]
  }));

  const totalXp = pieData.reduce((acc, cur) => acc + cur.value, 0);
  const overallLevel = Math.floor(totalXp / 10);

  return (
    <div style={{ color: "white", padding: 20 }}>
      <h2>Overall Level: {overallLevel}</h2>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 24 }}>
        {categories.map((key, i) => {
          const level = Math.floor((xpData[key] || 0) / 10);
          const xp = xpData[key] || 0;
          const progress = xp % 10;

          return (
            <div key={key} style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 4 }}><strong>{key.toUpperCase()} Level:</strong> {level}</div>
              <div style={{ background: "#333", height: 12, borderRadius: 6 }}>
                <div
                  style={{
                    width: `${(progress / 10) * 100}%`,
                    background: COLORS[i % COLORS.length],
                    height: "100%",
                    borderRadius: 6
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
