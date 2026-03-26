import React from "react";
import { NOVA_THEME } from "../lib/theme";
import type { TeacherTab, UserRole } from "../lib/types";

type TeacherPanelProps = {
  role: UserRole;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  selectedClass: string;
  renameClassName: string;
  setRenameClassName: (value: string) => void;
  newClassName: string;
  setNewClassName: (value: string) => void;
  studentText: string;
  setStudentText: (value: string) => void;
  taskText: string;
  setTaskText: (value: string) => void;
  studentPassword: string;
  setStudentPassword: (value: string) => void;
  teacherPassword: string;
  setTeacherPassword: (value: string) => void;
  statusControlsEnabled: boolean;
  onSetStatusControlsEnabled: (enabled: boolean) => void;
  onRenameClass: () => void;
  onAddClass: () => void;
  onSaveStudents: () => void;
  onSaveTasks: () => void;
  onSavePasswords: () => void;
  onResetGrid: () => void;
  message: string;
};

export default function TeacherPanel({
  role,
  teacherTab,
  setTeacherTab,
  selectedClass,
  renameClassName,
  setRenameClassName,
  newClassName,
  setNewClassName,
  studentText,
  setStudentText,
  taskText,
  setTaskText,
  studentPassword,
  setStudentPassword,
  teacherPassword,
  setTeacherPassword,
  statusControlsEnabled,
  onSetStatusControlsEnabled,
  onRenameClass,
  onAddClass,
  onSaveStudents,
  onSaveTasks,
  onSavePasswords,
  onResetGrid,
  message,
}: TeacherPanelProps) {
  const toggleTab = (tab: TeacherTab) => {
    setTeacherTab(teacherTab === tab ? "none" : tab);
  };

  const sectionButton = (key: TeacherTab, label: string) => (
    <button
      onClick={() => toggleTab(key)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        textAlign: "left",
        padding: "15px 18px",
        borderRadius: 18,
        border: `1px solid ${NOVA_THEME.border}`,
        background:
          teacherTab === key ? NOVA_THEME.olive : NOVA_THEME.panelSoft,
        color: teacherTab === key ? "white" : "#333",
        fontWeight: 800,
        fontSize: 15,
        cursor: "pointer",
        boxShadow:
          teacherTab === key
            ? "0 10px 22px rgba(0,0,0,0.10)"
            : "inset 0 0 0 1px rgba(255,255,255,0.45), 0 4px 10px rgba(0,0,0,0.04)",
        transition: "all 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span>{label}</span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 900,
          lineHeight: 1,
          opacity: 0.9,
        }}
      >
        {teacherTab === key ? "−" : "+"}
      </span>
    </button>
  );

  const cardStyle: React.CSSProperties = {
    background: NOVA_THEME.panelSoft,
    borderRadius: 22,
    padding: 20,
    border: `1px solid ${NOVA_THEME.border}`,
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.35), 0 8px 18px rgba(0,0,0,0.04)",
    marginTop: 12,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 13,
    borderRadius: 14,
    border: `1px solid ${NOVA_THEME.border}`,
    background: "white",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
    fontSize: 15,
  };

  const primaryBtn: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 14,
    border: "none",
    background: NOVA_THEME.olive,
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
  };

  const softBtn: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 14,
    border: "none",
    background: "#ECE5C8",
    color: "#4A5332",
    cursor: "pointer",
    fontWeight: 700,
  };

  const dangerBtn: React.CSSProperties = {
    ...primaryBtn,
    background: NOVA_THEME.peachDark,
  };

  return (
    <div
      style={{
        background: NOVA_THEME.panel,
        borderRadius: 28,
        padding: 22,
        border: `1px solid ${NOVA_THEME.border}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 6, fontSize: 22 }}>
        Beheercentrum
      </h3>
      <p style={{ color: "#666", marginTop: 0, marginBottom: 18 }}>
        Beheer: {selectedClass}
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <div>
          {sectionButton("class", "Klas")}
          {teacherTab === "class" && (
            <div style={{ display: "grid", gap: 16, ...cardStyle }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  padding: 16,
                  borderRadius: 18,
                  background: "white",
                  border: `1px solid ${NOVA_THEME.border}`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: "#2F2F2F" }}>
                    Bollen actief
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: "#666",
                      maxWidth: 520,
                    }}
                  >
                    Zet uit om alle bollen tijdelijk te blokkeren. Leerlingen
                    zien dan bovenaan een duidelijke rode melding.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSetStatusControlsEnabled(!statusControlsEnabled)
                  }
                  aria-pressed={statusControlsEnabled}
                  style={{
                    padding: "8px 10px 8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${NOVA_THEME.border}`,
                    background: statusControlsEnabled
                      ? "rgba(185,200,142,0.22)"
                      : "rgba(227,161,123,0.22)",
                    color: "#2F2F2F",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minHeight: 48,
                  }}
                >
                  <span>
                    {statusControlsEnabled ? "Actief" : "Niet actief"}
                  </span>

                  <span
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 999,
                      background: statusControlsEnabled ? "#F7FBF0" : "#FFF4EF",
                      position: "relative",
                      display: "inline-block",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: statusControlsEnabled ? 22 : 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: statusControlsEnabled
                          ? NOVA_THEME.greenDark
                          : NOVA_THEME.peachDark,
                        transition: "left 0.18s ease, background 0.18s ease",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                      }}
                    />
                  </span>
                </button>
              </div>

              {role === "admin" && (
                <>
                  <div>
                    <label style={{ fontWeight: 700 }}>Naam wijzigen</label>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        value={renameClassName}
                        onChange={(e) => setRenameClassName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onRenameClass();
                        }}
                        style={inputStyle}
                      />
                      <button style={softBtn} onClick={onRenameClass}>
                        Wijzig
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700 }}>Nieuwe klas</label>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onAddClass();
                        }}
                        style={inputStyle}
                      />
                      <button style={primaryBtn} onClick={onAddClass}>
                        Toevoegen
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <button style={dangerBtn} onClick={onResetGrid}>
                  Reset rooster
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {sectionButton("students", "Leerlingen")}
          {teacherTab === "students" && (
            <div style={cardStyle}>
              <label
                style={{ fontWeight: 700, display: "block", marginBottom: 10 }}
              >
                Leerlingen
              </label>
              <textarea
                value={studentText}
                onChange={(e) => setStudentText(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: 240,
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: 14 }}>
                <button style={primaryBtn} onClick={onSaveStudents}>
                  Leerlingen opslaan
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {sectionButton("tasks", "Taken")}
          {teacherTab === "tasks" && (
            <div style={cardStyle}>
              <label
                style={{ fontWeight: 700, display: "block", marginBottom: 10 }}
              >
                Taken
              </label>
              <textarea
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: 240,
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: 14 }}>
                <button style={primaryBtn} onClick={onSaveTasks}>
                  Taken opslaan
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {sectionButton("passwords", "Wachtwoorden")}
          {teacherTab === "passwords" && (
            <div style={{ display: "grid", gap: 16, ...cardStyle }}>
              <div>
                <label style={{ fontWeight: 700 }}>Leerling wachtwoord</label>
                <input
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  style={{ ...inputStyle, marginTop: 10 }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700 }}>Leerkracht wachtwoord</label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  style={{ ...inputStyle, marginTop: 10 }}
                />
              </div>

              <div>
                <button style={primaryBtn} onClick={onSavePasswords}>
                  Wachtwoorden opslaan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <p style={{ marginTop: 16, color: NOVA_THEME.olive, fontWeight: 700 }}>
          {message}
        </p>
      )}
    </div>
  );
}
