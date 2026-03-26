import React from "react";
import ReactDOM from "react-dom";
import { NOVA_THEME } from "../lib/theme";
import type { ThemeColorKey } from "../lib/types";

function LogoMarkSmall() {
  const petal = (color: string, inner: string, radius: string) => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: color,
        borderRadius: radius,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "40%",
          height: "40%",
          transform: "translate(-50%, -50%)",
          borderRadius: "36%",
          background: inner,
        }}
      />
    </div>
  );

  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 4,
        width: 48,
        height: 48,
        flexShrink: 0,
      }}
    >
      {petal("#E3A17B", "#D18E68", "40% 40% 18% 40%")}
      {petal("#F0CB62", "#DDB34D", "40% 40% 40% 18%")}
      {petal("#94CDD0", "#6FAFB3", "40% 18% 40% 40%")}
      {petal("#B9C88E", "#7FA16A", "18% 40% 40% 40%")}
    </div>
  );
}

function HeaderButton({
  children,
  onClick,
  active = false,
  buttonRef,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      style={{
        padding: "11px 16px",
        minHeight: 48,
        borderRadius: 16,
        border: active
          ? "1px solid rgba(255,255,255,0.44)"
          : "1px solid rgba(255,255,255,0.24)",
        background: active
          ? "rgba(255,255,255,0.24)"
          : "rgba(255,255,255,0.16)",
        color: "white",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: 0.1,
        boxShadow: active
          ? "0 10px 24px rgba(0,0,0,0.12)"
          : "0 8px 18px rgba(0,0,0,0.08)",
        backdropFilter: "blur(8px)",
        transition:
          "transform 0.16s ease, background 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
    >
      {children}
    </button>
  );
}

function ColorDot({
  color,
  active,
  label,
  onClick,
}: {
  color: string;
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        width: 46,
        height: 46,
        borderRadius: "999px",
        border: active ? "3px solid #2f2f2f" : "2px solid white",
        background: color,
        cursor: "pointer",
        boxShadow: active
          ? "0 0 0 7px rgba(0,0,0,0.08), 0 8px 18px rgba(0,0,0,0.10)"
          : "0 8px 18px rgba(0,0,0,0.12)",
        transition: "transform 0.16s ease, box-shadow 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
      }}
    />
  );
}

function ThemeCard({
  title,
  subtitle,
  active,
  color,
  onClick,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 12,
        borderRadius: 16,
        border: active
          ? "1px solid rgba(47,47,47,0.18)"
          : "1px solid rgba(228,222,192,0.95)",
        background: active ? "rgba(255,255,255,0.96)" : "rgba(251,248,238,0.9)",
        cursor: "pointer",
        boxShadow: active
          ? "0 10px 22px rgba(0,0,0,0.08)"
          : "0 4px 10px rgba(0,0,0,0.03)",
        transition:
          "transform 0.16s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            background: color,
            boxShadow: "0 0 0 4px rgba(0,0,0,0.05)",
            flexShrink: 0,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#2F2F2F",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              color: "#6A6A6A",
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </button>
  );
}

type AppHeaderProps = {
  pageColor: ThemeColorKey;
  setPageColor: (value: ThemeColorKey) => void;
  onLogout: () => void;
  toastsEnabled: boolean;
  setToastsEnabled: (value: boolean) => void;
  showStatusDisabledBadge?: boolean;
};

export default function AppHeader({
  pageColor,
  setPageColor,
  onLogout,
  toastsEnabled,
  setToastsEnabled,
  showStatusDisabledBadge = false,
}: AppHeaderProps) {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const themeLabels: Record<
    ThemeColorKey,
    { title: string; subtitle: string; color: string }
  > = {
    peach: {
      title: "Peach",
      subtitle: "warm en vriendelijk",
      color: NOVA_THEME.peach,
    },
    yellow: {
      title: "Yellow",
      subtitle: "licht en energiek",
      color: NOVA_THEME.yellow,
    },
    blue: {
      title: "Blue",
      subtitle: "rustig en helder",
      color: NOVA_THEME.blue,
    },
    green: {
      title: "Green",
      subtitle: "zacht en gebalanceerd",
      color: NOVA_THEME.green,
    },
  };

  const updateMenuPosition = React.useCallback(() => {
    const rect = toggleButtonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const menuWidth = Math.min(340, window.innerWidth - 32);
    const left = Math.max(
      16,
      Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 16)
    );
    const top = rect.bottom + 12;

    setMenuPosition({ top, left });
  }, []);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current?.contains(target)) return;
      if (toggleButtonRef.current?.contains(target)) return;

      setShowThemeMenu(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowThemeMenu(false);
      }
    }

    function handleReposition() {
      updateMenuPosition();
    }

    if (showThemeMenu) {
      updateMenuPosition();
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("resize", handleReposition);
      window.addEventListener("scroll", handleReposition, true);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [showThemeMenu, updateMenuPosition]);

  const menuPortal =
    showThemeMenu &&
    ReactDOM.createPortal(
      <>
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(72, 66, 47, 0.10)",
            backdropFilter: "blur(1.5px)",
            zIndex: 999,
            pointerEvents: "none",
          }}
        />

        <style>
          {`
            @keyframes nu4pMenuIn {
              0% {
                opacity: 0;
                transform: translateY(8px) scale(0.98);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>

        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            width: Math.min(340, window.innerWidth - 32),
            maxWidth: "calc(100vw - 32px)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(251,248,238,0.99) 100%)",
            borderRadius: 24,
            padding: 16,
            border: `1px solid ${NOVA_THEME.border}`,
            boxShadow:
              "0 28px 48px rgba(0,0,0,0.18), 0 4px 14px rgba(0,0,0,0.06)",
            zIndex: 1000,
            animation: "nu4pMenuIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#2F2F2F",
                }}
              >
                Kies paginakleur
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "#6A6A6A",
                  fontWeight: 600,
                }}
              >
                Gebaseerd op de 4 Nova-logo-kleuren.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowThemeMenu(false)}
              aria-label="Sluit kleurmenu"
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: `1px solid ${NOVA_THEME.border}`,
                background: "white",
                color: "#555",
                cursor: "pointer",
                fontWeight: 900,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              padding: "14px 14px 10px",
              borderRadius: 18,
              background: "#F7F4E8",
              justifyItems: "center",
              marginBottom: 14,
            }}
          >
            <ColorDot
              color={NOVA_THEME.peach}
              active={pageColor === "peach"}
              label="Kies peach"
              onClick={() => setPageColor("peach")}
            />
            <ColorDot
              color={NOVA_THEME.yellow}
              active={pageColor === "yellow"}
              label="Kies yellow"
              onClick={() => setPageColor("yellow")}
            />
            <ColorDot
              color={NOVA_THEME.blue}
              active={pageColor === "blue"}
              label="Kies blue"
              onClick={() => setPageColor("blue")}
            />
            <ColorDot
              color={NOVA_THEME.green}
              active={pageColor === "green"}
              label="Kies green"
              onClick={() => setPageColor("green")}
            />
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <ThemeCard
              title={themeLabels.peach.title}
              subtitle={themeLabels.peach.subtitle}
              color={themeLabels.peach.color}
              active={pageColor === "peach"}
              onClick={() => setPageColor("peach")}
            />
            <ThemeCard
              title={themeLabels.yellow.title}
              subtitle={themeLabels.yellow.subtitle}
              color={themeLabels.yellow.color}
              active={pageColor === "yellow"}
              onClick={() => setPageColor("yellow")}
            />
            <ThemeCard
              title={themeLabels.blue.title}
              subtitle={themeLabels.blue.subtitle}
              color={themeLabels.blue.color}
              active={pageColor === "blue"}
              onClick={() => setPageColor("blue")}
            />
            <ThemeCard
              title={themeLabels.green.title}
              subtitle={themeLabels.green.subtitle}
              color={themeLabels.green.color}
              active={pageColor === "green"}
              onClick={() => setPageColor("green")}
            />
          </div>
        </div>
      </>,
      document.body
    );

  return (
    <>
      <div
        style={{
          background: NOVA_THEME.shellBase[pageColor],
          padding: "20px 24px 120px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <style>
          {`
            @keyframes nu4pHeaderFadeIn {
              0% {
                opacity: 0;
                transform: translateY(8px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            overflow: "visible",
            position: "relative",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.14) 100%)",
              borderRadius: 32,
              padding: "18px 20px",
              border: "1px solid rgba(255,255,255,0.26)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
              boxShadow:
                "0 14px 28px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.22)",
              animation: "nu4pHeaderFadeIn 0.35s ease",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                minWidth: 0,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                  flexShrink: 0,
                }}
              >
                <LogoMarkSmall />
              </div>

              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.94)",
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Basisschool Nova
                </p>

                <h1
                  style={{
                    margin: "4px 0 0",
                    fontSize: 30,
                    lineHeight: 1.05,
                    color: "white",
                    letterSpacing: -0.4,
                  }}
                >
                  NU4P
                </h1>

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 600,
                  }}
                >
                  Nova Unit 4 planner
                </p>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "7px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.20)",
                      color: "rgba(255,255,255,0.96)",
                      fontSize: 12,
                      fontWeight: 800,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    Nova stijl actief
                  </span>

                  <span
                    style={{
                      padding: "7px 10px",
                      borderRadius: 999,
                      background: toastsEnabled
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "rgba(255,255,255,0.96)",
                      fontSize: 12,
                      fontWeight: 800,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    Toasts {toastsEnabled ? "aan" : "uit"}
                  </span>

                  {showStatusDisabledBadge && (
                    <span
                      style={{
                        padding: "7px 10px",
                        borderRadius: 999,
                        background: "rgba(209,142,104,0.96)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 900,
                        backdropFilter: "blur(6px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.10)",
                      }}
                    >
                      Bollen niet actief
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                position: "relative",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                zIndex: 40,
              }}
            >
              <HeaderButton
                buttonRef={toggleButtonRef}
                onClick={() => setShowThemeMenu((prev) => !prev)}
                active={showThemeMenu}
              >
                Nova stijl
              </HeaderButton>

              <button
                type="button"
                onClick={() => setToastsEnabled(!toastsEnabled)}
                aria-pressed={toastsEnabled}
                style={{
                  padding: "8px 10px 8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.24)",
                  background: "rgba(255,255,255,0.16)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 48,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span>Toasts</span>

                <span
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: toastsEnabled
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.36)",
                    position: "relative",
                    display: "inline-block",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: toastsEnabled ? 22 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: toastsEnabled
                        ? NOVA_THEME.greenDark
                        : "white",
                      transition: "left 0.18s ease, background 0.18s ease",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                    }}
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: "11px 16px",
                  minHeight: 48,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background:
                    "linear-gradient(180deg, rgba(209,142,104,0.98) 0%, rgba(200,132,95,0.98) 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                }}
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuPortal}
    </>
  );
}
