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
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
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

        {/* Centered & well-spaced multiline message */}
        {Array.isArray(message) ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {message.map((line, idx) => (
              <div
                key={idx}
                style={{
                  fontWeight: idx === 0 ? "600" : "normal",
                  fontSize: idx === 0 ? "1rem" : "0.95rem",
                  lineHeight: 1.6,
                  maxWidth: "100%",
                  wordWrap: "break-word",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginBottom: "2rem", fontSize: "1rem", lineHeight: "1.8" }}>
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
