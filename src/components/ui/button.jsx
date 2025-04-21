// src/components/button.jsx
import React from "react";

export function Button({ children, className, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-4 py-2 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}
