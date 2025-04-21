import React, { useState } from "react";
import AppShell from "./AppShell";
import LevelsPage from "./LevelsPage";
import ProgressPage from "./ProgressPage";
import ProfilePage from "./ProfilePage";
import WorkoutTracker from "./WorkoutTracker";
import BottomNavigation from "../components/BottomNavigation";
import { useAuthStore } from "../Stores/AuthStore";
import LoginPage from "./LoginPage";

export default function MainShell() {
  const user = useAuthStore((state) => state.user);
  const isUserReady = user && user.displayName;

  const [tab, setTab] = useState("home");

  if (!isUserReady) {
    return <LoginPage onLogin={() => setTab("home")} />;
  }

  const renderTab = () => {
    switch (tab) {
      case "home":
        return <AppShell />;
      case "levels":
        return <LevelsPage />;
      case "progress":
        return <ProgressPage />;
      case "profile":
        return <ProfilePage />;
      case "tracker":
        return <WorkoutTracker />;
      default:
        return <AppShell />;
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderTab()}
      </div>
      <BottomNavigation currentTab={tab} setTab={setTab} />
    </div>
  );
}
