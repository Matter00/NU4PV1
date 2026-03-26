import React from "react";
import { NOVA_THEME } from "../lib/theme";
import type { ThemeColorKey } from "../lib/types";

function ColorDot({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: "999px",
        border: active ? "3px solid #2f2f2f" : "2px solid white",
        background: color,
        cursor: "pointer",
        boxShadow: active
          ? "0 0 0 4px rgba(0,0,0,0.08)"
          : "0 4px 12px rgba(0,0,0,0.12)",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    />
  );
}

export default function ThemePicker({
  pageColor,
  setPageColor,
}: {
  pageColor: ThemeColorKey;
  setPageColor: (value: ThemeColorKey) => void;
}) {
  return (
    <div
      style={{
        marginBottom: 20,
        background: NOVA_THEME.panel,
        borderRadius: 28,
        padding: 22,
        border: `1px solid ${NOVA_THEME.border}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>Nova stijl</p>
      <p style={{ margin: "8px 0 14px", color: "#666" }}>
        Kies hier de paginakleur op basis van de 4 logo-kleuren.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <ColorDot
          color={NOVA_THEME.peach}
          active={pageColor === "peach"}
          onClick={() => setPageColor("peach")}
        />
        <ColorDot
          color={NOVA_THEME.yellow}
          active={pageColor === "yellow"}
          onClick={() => setPageColor("yellow")}
        />
        <ColorDot
          color={NOVA_THEME.blue}
          active={pageColor === "blue"}
          onClick={() => setPageColor("blue")}
        />
        <ColorDot
          color={NOVA_THEME.green}
          active={pageColor === "green"}
          onClick={() => setPageColor("green")}
        />
      </div>
    </div>
  );
}
