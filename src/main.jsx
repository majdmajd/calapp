// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainShell from './pages/MainShell';
import "../index.css";  // ✅ correct path from src → parent


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainShell />
  </React.StrictMode>
);