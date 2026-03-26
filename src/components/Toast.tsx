import React from "react";

type ToastItem = {
  id: number;
  text: string;
};

export default function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            minWidth: 220,
            maxWidth: 320,
            background: "#FFFDF7",
            border: "1px solid #E7DFC5",
            borderRadius: 18,
            padding: "14px 18px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
            fontWeight: 700,
            fontSize: 14,
            color: "#3a3a3a",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "toastSlideIn 0.35s ease",
            pointerEvents: "auto",
          }}
        >
          {/* bolletje icoon */}
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "999px",
              background: "#D9E3B2",
              boxShadow: "0 0 0 4px #EEF3D4",
              flexShrink: 0,
            }}
          />

          <span style={{ lineHeight: 1.3 }}>{toast.text}</span>
        </div>
      ))}

      <style>
        {`
          @keyframes toastSlideIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}
