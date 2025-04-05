import React from "react";
import ReactDOM from "react-dom/client";
import MainShell from "./pages/MainShell"; // ✅ UPDATED
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainShell />
  </React.StrictMode>
);
