// SkillIconGallery.jsx
import React from "react";
import { Card, CardContent } from "../ui/card";


import {
  Dumbbell,
  Armchair,
  Flame,
  Accessibility,
  ArrowUp,
  Hand,
  Activity,
  Sparkles,
  BadgeCheck,
  Zap,
  Star,
  Weight,
  LayoutDashboard
} from "lucide-react";

const skills = [
  { name: "Knee Push-Ups", icon: <Accessibility /> },
  { name: "Incline Push-Ups", icon: <ArrowUp /> },
  { name: "Push-Ups", icon: <Flame /> },
  { name: "Archer Push-Ups", icon: <Hand /> },
  { name: "Wall Pike Push-Ups", icon: <Activity /> },
  { name: "Straight Bar Dips", icon: <Dumbbell /> },
  { name: "Ring Dips", icon: <Sparkles /> },
  { name: "Weighted Dips", icon: <Weight /> },
  { name: "One-Arm Push-Ups", icon: <BadgeCheck /> },
  { name: "Freestanding HSPU", icon: <Star /> },
  { name: "90° Push-Up", icon: <Zap /> },
];

export default function SkillIconGallery() {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-black min-h-screen text-white">
      {skills.map((skill) => (
        <Card key={skill.name} className="bg-[#111] border-[#333] text-white shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
            <div className="text-3xl">{skill.icon}</div>
            <div className="text-sm text-center font-medium">{skill.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
