import React from "react";

export default function CustomModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true
}) {
  if (!isOpen) return null;

  // Convert message string to array of lines if it's not already an array
  const messageLines = Array.isArray(message) ? message : message.split("\n");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 9999,
        backdropFilter: "blur(3px)",
      }}
      onClick={showCancel ? onCancel : null}
    >
      <div
        style={{
          backgroundColor: "#121212",
          width: "90%",
          maxWidth: "400px",
          borderRadius: "8px",
          overflow: "hidden",
          animation: "modalAppear 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Black with white text */}
        <div 
          style={{
            backgroundColor: "#121212", 
            padding: "16px",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {title}
        </div>

        {/* Modal Body - Black background with white text */}
        <div
          style={{
            backgroundColor: "#121212",
            padding: "20px 16px",
            color: "white",
            fontSize: "15px",
            lineHeight: "1.5",
          }}
        >
          {/* Body text content */}
          <div>
            {messageLines.map((line, i) => (
              <p key={i} style={{ 
                marginBottom: i < messageLines.length - 1 ? "16px" : "24px",
                fontWeight: "normal"
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* Buttons at the bottom of content area */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px"
            }}
          >
            {showCancel && (
              <button
                onClick={onCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6", // Blue button - the only blue element
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}