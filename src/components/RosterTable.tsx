import React from "react";
import { NOVA_THEME } from "../lib/theme";
import type { UserRole } from "../lib/types";

type StatusColor = "red" | "green" | "orange";
type ChangedMap = Record<string, number>;

const STATUS_STYLES: Record<
  StatusColor,
  {
    bg: string;
    ring: string;
    halo: string;
    label: string;
  }
> = {
  red: {
    bg: NOVA_THEME.peach,
    ring: "#F0D1BE",
    halo: "rgba(240, 209, 190, 0.38)",
    label: "Nog niet klaar",
  },
  green: {
    bg: NOVA_THEME.green,
    ring: "#D8E1BE",
    halo: "rgba(216, 225, 190, 0.38)",
    label: "Klaar",
  },
  orange: {
    bg: NOVA_THEME.yellow,
    ring: "#F1DEAA",
    halo: "rgba(241, 222, 170, 0.42)",
    label: "Hulp nodig",
  },
};

export default function RosterTable({
  data,
  grid,
  updateStatus,
  canInteract,
  dotsDisabledForStudents,
  role,
}: {
  data: {
    students: string[];
    tasks: string[];
  };
  grid: Record<string, Record<string, string>>;
  updateStatus: (student: string, task: string) => void;
  canInteract: boolean;
  dotsDisabledForStudents: boolean;
  role: UserRole;
}) {
  const previousGridRef = React.useRef<Record<string, Record<string, string>>>(
    {}
  );

  const [changedCells, setChangedCells] = React.useState<ChangedMap>({});
  const [hoveredStudent, setHoveredStudent] = React.useState<string | null>(
    null
  );
  const [hoveredTask, setHoveredTask] = React.useState<string | null>(null);
  const [pressedCell, setPressedCell] = React.useState<string | null>(null);

  React.useEffect(() => {
    const previousGrid = previousGridRef.current;
    const nextChanged: ChangedMap = {};

    data.students.forEach((student) => {
      data.tasks.forEach((task) => {
        const prev = previousGrid?.[student]?.[task];
        const next = grid?.[student]?.[task];

        if (prev && next && prev !== next) {
          nextChanged[`${student}__${task}`] = Date.now();
        }
      });
    });

    if (Object.keys(nextChanged).length > 0) {
      setChangedCells((prev) => ({ ...prev, ...nextChanged }));

      const timeout = window.setTimeout(() => {
        setChangedCells((prev) => {
          const updated = { ...prev };
          Object.keys(nextChanged).forEach((key) => {
            delete updated[key];
          });
          return updated;
        });
      }, 1250);

      previousGridRef.current = grid;
      return () => window.clearTimeout(timeout);
    }

    previousGridRef.current = grid;
  }, [grid, data.students, data.tasks]);

  const helperText =
    role === "student" && dotsDisabledForStudents
      ? "De bollen zijn momenteel niet actief."
      : "Klik op een bol om de status van een taak te wijzigen.";

  const buttonTitle = (label: string) =>
    role === "student" && dotsDisabledForStudents
      ? "Bollen zijn momenteel niet actief"
      : label;

  const isLockedForStudent = role === "student" && dotsDisabledForStudents;

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,251,246,0.96) 100%)",
        borderRadius: 30,
        padding: 14,
        border: `1px solid ${NOVA_THEME.border}`,
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes nu4pCellGlow {
            0% {
              transform: scale(0.96);
              box-shadow: 0 0 0 0 rgba(255, 221, 120, 0);
            }
            35% {
              transform: scale(1.05);
              box-shadow: 0 0 0 12px rgba(255, 221, 120, 0.22);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 221, 120, 0);
            }
          }

          @keyframes nu4pDotPress {
            0% { transform: scale(1); }
            50% { transform: scale(0.92); }
            100% { transform: scale(1); }
          }

          @keyframes nu4pBadgeIn {
            0% {
              opacity: 0;
              transform: translateY(4px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes nu4pUnlock {
            0% {
              transform: scale(0.92);
              opacity: 0.7;
            }
            60% {
              transform: scale(1.04);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes nu4pLockFade {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0.52;
              transform: scale(0.98);
            }
          }
        `}
      </style>

      {isLockedForStudent && (
        <div
          style={{
            margin: "4px 8px 12px",
            padding: "10px 14px",
            borderRadius: 14,
            background: "rgba(209,142,104,0.12)",
            border: "1px solid rgba(209,142,104,0.22)",
            color: "#7A4E3A",
            fontWeight: 700,
            fontSize: 13,
            boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
          }}
        >
          Bollen zijn tijdelijk uitgeschakeld door de leerkracht.
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "4px 8px 14px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#2f2f2f",
              letterSpacing: -0.2,
            }}
          >
            Klassenrooster
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6A6A6A",
              marginTop: 4,
            }}
          >
            {helperText}
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#686868",
            background: "rgba(255,255,255,0.72)",
            border: `1px solid ${NOVA_THEME.border}`,
            borderRadius: 999,
            padding: "8px 12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          }}
        >
          {data.students.length} leerlingen · {data.tasks.length} taken
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 24,
          border: `1px solid ${NOVA_THEME.border}`,
          background: "rgba(255,255,255,0.72)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 820,
          }}
        >
          <thead>
            <tr style={{ background: NOVA_THEME.panelSoft }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "18px 18px",
                  borderBottom: `1px solid ${NOVA_THEME.border}`,
                  borderRight: `1px solid ${NOVA_THEME.border}`,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: 0.45,
                  position: "sticky",
                  left: 0,
                  background: NOVA_THEME.panelSoft,
                  zIndex: 3,
                  minWidth: 210,
                }}
              >
                Leerling
              </th>

              {data.tasks.map((task, index) => {
                const isColumnHovered = hoveredTask === task;

                return (
                  <th
                    key={task}
                    style={{
                      textAlign: "center",
                      padding: "18px 16px",
                      borderBottom: `1px solid ${NOVA_THEME.border}`,
                      borderRight:
                        index !== data.tasks.length - 1
                          ? `1px solid ${NOVA_THEME.border}`
                          : undefined,
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#444",
                      minWidth: 150,
                      background: isColumnHovered
                        ? "rgba(255,255,255,0.9)"
                        : NOVA_THEME.panelSoft,
                      transition: "background 0.18s ease",
                    }}
                  >
                    {task}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {data.students.map((student, rowIndex) => {
              const isRowHovered = hoveredStudent === student;
              const rowBaseBg = rowIndex % 2 === 0 ? "#FFFFFF" : "#FCFBF6";
              const rowHoverBg = "rgba(255,255,255,0.98)";

              return (
                <tr
                  key={student}
                  style={{
                    background: isRowHovered ? rowHoverBg : rowBaseBg,
                    transition: "background 0.18s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "18px 18px",
                      borderBottom: `1px solid ${NOVA_THEME.border}`,
                      borderRight: `1px solid ${NOVA_THEME.border}`,
                      fontWeight: 800,
                      color: "#2F2F2F",
                      position: "sticky",
                      left: 0,
                      background: isRowHovered ? rowHoverBg : rowBaseBg,
                      zIndex: 2,
                      transition: "background 0.18s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {student}
                  </td>

                  {data.tasks.map((task, index) => {
                    const status = (grid?.[student]?.[task] ??
                      "red") as StatusColor;
                    const style = STATUS_STYLES[status] || STATUS_STYLES.red;
                    const cellKey = `${student}__${task}`;
                    const wasChanged = Boolean(changedCells[cellKey]);
                    const isPressed = pressedCell === cellKey;
                    const isColumnHovered = hoveredTask === task;
                    const isFocused = isRowHovered || isColumnHovered;

                    return (
                      <td
                        key={task}
                        style={{
                          padding: "14px 10px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          borderBottom: `1px solid ${NOVA_THEME.border}`,
                          borderRight:
                            index !== data.tasks.length - 1
                              ? `1px solid ${NOVA_THEME.border}`
                              : undefined,
                          background: wasChanged
                            ? "linear-gradient(180deg, rgba(255,245,208,0.72) 0%, rgba(255,251,238,0.9) 100%)"
                            : isFocused
                            ? "rgba(255,255,255,0.78)"
                            : "transparent",
                          transition:
                            "background 0.22s ease, box-shadow 0.22s ease",
                          position: "relative",
                        }}
                        onMouseEnter={() => {
                          setHoveredStudent(student);
                          setHoveredTask(task);
                        }}
                        onMouseLeave={() => {
                          setHoveredStudent((current) =>
                            current === student ? null : current
                          );
                          setHoveredTask((current) =>
                            current === task ? null : current
                          );
                        }}
                      >
                        {wasChanged && (
                          <span
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              fontSize: 10,
                              fontWeight: 900,
                              color: "#8A6A1F",
                              background: "rgba(255,249,221,0.95)",
                              border: "1px solid rgba(235,213,132,0.9)",
                              borderRadius: 999,
                              padding: "4px 7px",
                              lineHeight: 1,
                              animation: "nu4pBadgeIn 0.22s ease",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                            }}
                          >
                            update
                          </span>
                        )}

                        <button
                          onClick={() => {
                            if (!canInteract) return;
                            updateStatus(student, task);
                          }}
                          disabled={!canInteract}
                          onMouseDown={() => {
                            if (canInteract) setPressedCell(cellKey);
                          }}
                          onMouseUp={() => setPressedCell(null)}
                          onMouseLeave={() => setPressedCell(null)}
                          onBlur={() => setPressedCell(null)}
                          title={buttonTitle(style.label)}
                          aria-label={`${student} - ${task} - ${style.label}`}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: "999px",
                            border: "none",
                            background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.5) 0%, ${style.bg} 55%)`,
                            boxShadow: wasChanged
                              ? `0 0 0 9px rgba(255, 228, 138, 0.42), 0 12px 22px rgba(0,0,0,0.10)`
                              : isFocused && !isLockedForStudent
                              ? `0 0 0 8px ${style.halo}, 0 12px 20px rgba(0,0,0,0.08)`
                              : `0 0 0 6px ${style.ring}, 0 8px 16px rgba(0,0,0,0.07)`,
                            cursor: canInteract ? "pointer" : "not-allowed",
                            transition:
                              "transform 0.16s ease, box-shadow 0.2s ease, filter 0.2s ease, opacity 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: isLockedForStudent
                              ? "nu4pLockFade 0.2s ease"
                              : wasChanged
                              ? "nu4pCellGlow 1s ease"
                              : "nu4pUnlock 0.22s ease",
                            transform:
                              canInteract && isPressed
                                ? "scale(0.95)"
                                : canInteract && isFocused
                                ? "translateY(-1px) scale(1.04)"
                                : "translateY(0) scale(1)",
                            filter: isLockedForStudent
                              ? "grayscale(0.22) brightness(0.96)"
                              : canInteract && isFocused
                              ? "saturate(1.03)"
                              : "none",
                            outline: "none",
                            opacity: isLockedForStudent ? 0.52 : 1,
                          }}
                        >
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "999px",
                              background: "rgba(255,255,255,0.42)",
                              opacity: 0.55,
                              boxShadow:
                                "inset 0 1px 1px rgba(255,255,255,0.4)",
                            }}
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          padding: "16px 8px 8px",
          fontSize: 14,
        }}
      >
        {(
          Object.entries(STATUS_STYLES) as [
            StatusColor,
            (typeof STATUS_STYLES)[StatusColor]
          ][]
        ).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.74)",
              border: `1px solid ${NOVA_THEME.border}`,
              borderRadius: 999,
              padding: "10px 14px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "999px",
                background: value.bg,
                display: "inline-block",
                boxShadow: `0 0 0 5px ${value.ring}`,
              }}
            />
            <span style={{ color: "#444", fontWeight: 800 }}>
              {value.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
