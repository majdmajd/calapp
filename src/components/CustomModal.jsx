import React from "react";

export default function CustomModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  showCancel = true,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  const cardStyle = {
    background: "#111",
    color: "#fff",
    padding: "2.5rem",
    borderRadius: "1rem",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div style={cardStyle}>
        {title && (
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", fontWeight: "bold" }}>
            {title}
          </h2>
        )}

        {/* Single-line + Spaced Message */}
        {Array.isArray(message) ? (
          message.length === 1 ? (
            <div style={{ whiteSpace: "nowrap", overflowWrap: "normal" }}>{message[0]}</div>
          ) : (
            <>
              <div style={{ marginBottom: "0.75rem" }}>{message[0]}</div>
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {message.slice(1).map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </>
          )
        ) : (
          <p style={{ marginBottom: "2.5rem", fontSize: "1rem", lineHeight: "1.8" }}>
            {message}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem" }}>
          {showCancel && (
            <button
              onClick={onCancel}
              style={{
                background: "#444",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.2rem",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{
              background: "#1e90ff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1.2rem",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
