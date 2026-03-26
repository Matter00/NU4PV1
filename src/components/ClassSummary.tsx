import React from "react";
import { NOVA_THEME } from "../lib/theme";

function SummaryCard({
  label,
  value,
  bg,
  border,
  color,
}: {
  label: string;
  value: number;
  bg: string;
  border: string;
  color: string;
}) {
  return (
    <div
      style={{
        minWidth: 100,
        borderRadius: 20,
        padding: "14px 16px",
        textAlign: "center",
        background: bg,
        boxShadow: `inset 0 0 0 1px ${border}, 0 6px 18px rgba(0,0,0,0.04)`,
      }}
    >
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color }}>{label}</p>
      <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 800, color }}>
        {value}
      </p>
    </div>
  );
}

export default function ClassSummary({
  activeClass,
  roleLabel,
  red,
  green,
  orange,
}: {
  activeClass: string;
  roleLabel: string;
  red: number;
  green: number;
  orange: number;
}) {
  return (
    <>
      <style>
        {`
          @keyframes nu4pSummaryIn {
            0% {
              opacity: 0;
              transform: translateY(10px) scale(0.985);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <div
        style={{
          marginTop: -70,
          marginBottom: 20,
          background: NOVA_THEME.panel,
          borderRadius: 28,
          padding: 22,
          border: `1px solid ${NOVA_THEME.border}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "center",
          flexWrap: "wrap",
          animation: "nu4pSummaryIn 0.38s ease",
          position: "relative",
          zIndex: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 26 }}>{activeClass}</h2>
          <p style={{ margin: "8px 0 0", color: "#666", fontWeight: 600 }}>
            {roleLabel}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <SummaryCard
            label="Open"
            value={red}
            bg="#F6E3D7"
            border="#EBC6AE"
            color="#9E5B3F"
          />
          <SummaryCard
            label="Klaar"
            value={green}
            bg="#E5ECD2"
            border="#CDD9AA"
            color="#5D7744"
          />
          <SummaryCard
            label="Hulp"
            value={orange}
            bg="#F8EDC9"
            border="#E7D18C"
            color="#997226"
          />
        </div>
      </div>
    </>
  );
}
