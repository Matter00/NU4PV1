import React from "react";
import { NOVA_THEME } from "../lib/theme";
import type { SchoolClass, UserRole } from "../lib/types";

function LogoMark() {
  const petal = (color: string, inner: string, radius: string) => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: color,
        borderRadius: radius,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "34%",
          height: "34%",
          transform: "translate(-50%, -50%)",
          borderRadius: "36%",
          background: inner,
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 6,
        width: 80,
        height: 80,
        margin: "0 auto",
        animation: "nu4pFloat 3.2s ease-in-out infinite",
      }}
    >
      {petal(NOVA_THEME.peach, NOVA_THEME.peachDark, "40% 40% 18% 40%")}
      {petal(NOVA_THEME.yellow, "#DDB34D", "40% 40% 40% 18%")}
      {petal(NOVA_THEME.blue, NOVA_THEME.blueDark, "40% 18% 40% 40%")}
      {petal(NOVA_THEME.green, NOVA_THEME.greenDark, "18% 40% 40% 40%")}
    </div>
  );
}

type SplashLoginProps = {
  classes: Record<string, SchoolClass>;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  role: UserRole;
  setRole: (value: UserRole) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
  onLogin: () => void;
};

export default function SplashLogin({
  classes,
  selectedClass,
  setSelectedClass,
  role,
  setRole,
  password,
  setPassword,
  error,
  onLogin,
}: SplashLoginProps) {
  const classNames = Object.keys(classes);

  const roleColor =
    role === "admin"
      ? NOVA_THEME.blueDark
      : role === "teacher"
      ? NOVA_THEME.peachDark
      : NOVA_THEME.greenDark;

  const roleBackground =
    role === "admin"
      ? NOVA_THEME.shellBase.blue
      : role === "teacher"
      ? NOVA_THEME.shellBase.peach
      : NOVA_THEME.shellBase.green;

  const roleButtonStyle = (
    active: boolean,
    color: string
  ): React.CSSProperties => ({
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #E4DEC0",
    background: active ? color : "white",
    color: active ? "white" : "#333",
    fontWeight: 600,
    cursor: "pointer",
    minWidth: 110,
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease",
    boxShadow: active
      ? "0 8px 18px rgba(0,0,0,0.12)"
      : "0 2px 8px rgba(0,0,0,0.05)",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `2px solid ${roleColor}`,
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
    background: "rgba(255,255,255,0.96)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: roleBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        transition: "background 0.35s ease",
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes nu4pFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }

          @keyframes nu4pCardIn {
            0% {
              opacity: 0;
              transform: translateY(18px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 28,
          padding: 28,
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          animation: "nu4pCardIn 0.45s ease",
        }}
      >
        <LogoMark />

        <h1
          style={{
            margin: "18px 0 0",
            fontSize: 32,
            color: roleColor,
            transition: "color 0.25s ease",
          }}
        >
          NU4P
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: roleColor,
            transition: "color 0.25s ease",
          }}
        >
          Nova Unit 4 planner
        </p>

        <div style={{ marginTop: 24, textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: roleColor,
              transition: "color 0.25s ease",
            }}
          >
            Kies eerst een klas
          </label>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 4px ${roleColor}22`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {classNames.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("student")}
            style={roleButtonStyle(role === "student", NOVA_THEME.greenDark)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Leerling
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            style={roleButtonStyle(role === "teacher", NOVA_THEME.peachDark)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Leerkracht
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            style={roleButtonStyle(role === "admin", NOVA_THEME.blueDark)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Admin
          </button>
        </div>

        <div style={{ marginTop: 24, textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: roleColor,
              transition: "color 0.25s ease",
            }}
          >
            Wachtwoord
          </label>

          <input
            type="password"
            placeholder={
              role === "admin"
                ? "Admin wachtwoord"
                : role === "teacher"
                ? "Leerkracht wachtwoord"
                : "Leerling wachtwoord"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onLogin();
            }}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 4px ${roleColor}22`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          />
        </div>

        {error ? (
          <p style={{ marginTop: 12, color: "#B00020", fontWeight: 600 }}>
            {error}
          </p>
        ) : (
          <p style={{ marginTop: 12, color: "#777", fontSize: 14 }}>
            Kies een klas, selecteer je rol en vul het juiste wachtwoord in.
          </p>
        )}

        <button
          type="submit"
          style={{
            marginTop: 20,
            width: "100%",
            padding: "14px 18px",
            borderRadius: 14,
            border: "none",
            background: roleColor,
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            transition:
              "transform 0.15s ease, box-shadow 0.15s ease, background 0.25s ease",
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.10)";
          }}
        >
          Start
        </button>
      </form>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "rgba(255,255,255,0.72)",
          fontWeight: 700,
          letterSpacing: 0.6,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        © Matter
      </div>
    </div>
  );
}
