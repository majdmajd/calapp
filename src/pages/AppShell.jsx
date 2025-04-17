import React, { useState } from "react";
import PullTree from "../components/PullTree";
import PushTree from "../components/PushTree";
import CoreTree from "../components/CoreTree";
import LegsTree from "../components/LegsTree";

export default function AppShell() {
  const [tab, setTab] = useState("pull");

  const trees = {
    pull: <PullTree />,
    push: <PushTree fitViewTrigger={tab} />,
    core: <CoreTree />,
    legs: <LegsTree />,
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex justify-around items-center bg-[#111] border-b-2 border-[#222] h-12 w-full">
        {Object.keys(trees).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 text-sm font-bold uppercase cursor-pointer transition-colors duration-200 ${
              tab === key ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {trees[tab]}
      </div>
    </div>
  );
}