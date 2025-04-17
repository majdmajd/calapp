import React from "react";
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart';
import colors from 'tailwindcss/colors';
import { useSkillStore } from "../Stores/SkillStore";

const COLORS = [
  colors.blue[300],
  colors.blue[500],
  colors.blue[700],
  colors.blue[800],
];

export default function LevelsPage() {
  const xpData = useSkillStore((state) => state.getXpData());
  const categories = ["push", "pull", "core", "legs"];
  const pieData = categories.map((key, i) => ({
    name: key.toUpperCase(),
    value: xpData[key] || 0,
    color: COLORS[i % COLORS.length]
  }));

  const totalXp = pieData.reduce((acc, cur) => acc + cur.value, 0);
  const overallLevel = Math.floor(totalXp / 10);

  return (
    <div className="text-white p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Overall Level: {overallLevel}
      </h2>

      <div className="w-full flex justify-center items-center mb-6 h-52">
        <MinimalPieChart
          data={pieData.map(({ name, value, color }) => ({
            title: name,
            value,
            color
          }))}
          lineWidth={35}
          radius={40}
          animate
          paddingAngle={.5}
        />
      </div>

      <div className="space-y-6">
        {categories.map((key, i) => {
          const level = Math.floor((xpData[key] || 0) / 10);
          const xp = xpData[key] || 0;
          const progress = xpData[key] ? xpData[key] % 10 : 0;

          return (
            <div key={key}>
              <div className="mb-1 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} Level: {level}</div>
              <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(progress / 10) * 100}%`,
                    backgroundColor: COLORS[i % COLORS.length]
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
