import React from "react";
import {
  adminLogin,
  fetchClasses,
  saveStatus,
  saveStatusControls,
  addClass as addClassApi,
  renameClass as renameClassApi,
  saveStudents as saveStudentsApi,
  saveTasks as saveTasksApi,
  savePasswords as savePasswordsApi,
} from "./lib/api";
import { socket } from "./lib/socket";
import { createGrid } from "./lib/helpers";
import {
  getStoredPageColor,
  getStoredSession,
  parseLines,
  SESSION_DURATION_MS,
  STORAGE_KEY_SESSION,
} from "./lib/storage";
import {
  NOVA_THEME,
  STORAGE_KEY_PAGE_COLOR,
  STORAGE_KEY_TOASTS_ENABLED,
} from "./lib/theme";

import RosterTable from "./components/RosterTable";
import SplashLogin from "./components/SplashLogin";
import TeacherPanel from "./components/TeacherPanel";
import AppHeader from "./components/AppHeader";
import ClassSummary from "./components/ClassSummary";
import Toast from "./components/Toast";

import type {
  SchoolClass,
  SessionType,
  TeacherTab,
  ThemeColorKey,
  UserRole,
  StatusColor,
} from "./lib/types";

type ToastItem = { id: number; text: string };

export default function App() {
  const [session, setSession] = React.useState<SessionType>(getStoredSession);
  const [classes, setClasses] = React.useState<Record<string, SchoolClass>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [pageColor, setPageColor] = React.useState<ThemeColorKey>(() =>
    getStoredPageColor(STORAGE_KEY_PAGE_COLOR)
  );

  const [toastsEnabled, setToastsEnabled] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TOASTS_ENABLED);
      return raw === null ? true : raw === "true";
    } catch {
      return true;
    }
  });

  const [selectedClass, setSelectedClass] = React.useState("");
  const [adminSelectedClass, setAdminSelectedClass] = React.useState("");

  const [role, setRole] = React.useState<UserRole>("student");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const [teacherTab, setTeacherTab] = React.useState<TeacherTab>("none");
  const [renameClassName, setRenameClassName] = React.useState("");
  const [newClassName, setNewClassName] = React.useState("");
  const [studentText, setStudentText] = React.useState("");
  const [taskText, setTaskText] = React.useState("");
  const [studentPassword, setStudentPassword] = React.useState("");
  const [teacherPassword, setTeacherPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const classNames = React.useMemo(() => Object.keys(classes), [classes]);

  const addToast = React.useCallback(
    (text: string) => {
      if (!toastsEnabled) return;

      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, text }]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    [toastsEnabled]
  );

  const syncSelectedClassAfterLoad = React.useCallback(
    (fresh: Record<string, SchoolClass>) => {
      const names = Object.keys(fresh);

      if (names.length === 0) {
        setSelectedClass("");
        setAdminSelectedClass("");
        return;
      }

      setSelectedClass((prev) => (prev && fresh[prev] ? prev : names[0]));
      setAdminSelectedClass((prev) => (prev && fresh[prev] ? prev : names[0]));
    },
    []
  );

  const reloadClasses = React.useCallback(async () => {
    const fresh = await fetchClasses();
    setClasses(fresh);
    syncSelectedClassAfterLoad(fresh);
    return fresh;
  }, [syncSelectedClassAfterLoad]);

  React.useEffect(() => {
    async function loadInitialData() {
      try {
        await reloadClasses();
      } catch (err) {
        console.error("Klassen laden mislukt", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [reloadClasses]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PAGE_COLOR, pageColor);
  }, [pageColor]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TOASTS_ENABLED, String(toastsEnabled));
  }, [toastsEnabled]);

  React.useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  }, [session]);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;

        if (Date.now() > prev.expiresAt) {
          localStorage.removeItem(STORAGE_KEY_SESSION);
          return null;
        }

        return prev;
      });
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const activeClass = React.useMemo(() => {
    const firstClass = classNames[0] || "";

    if (session?.role === "admin") {
      return classes[adminSelectedClass] ? adminSelectedClass : firstClass;
    }

    if (session?.class && classes[session.class]) {
      return session.class;
    }

    return classes[selectedClass] ? selectedClass : firstClass;
  }, [classNames, classes, session, adminSelectedClass, selectedClass]);

  const data = classes[activeClass];

  const grid = React.useMemo(() => {
    if (!data) return {};
    return createGrid(data.students, data.tasks, data.grid);
  }, [data]);

  const statusControlsEnabled = data?.statusControlsEnabled ?? true;

  const canInteractWithDots =
    Boolean(session) && (session.role !== "student" || statusControlsEnabled);

  React.useEffect(() => {
    if (!data) return;

    setRenameClassName(activeClass);
    setStudentText(data.students.join("\n"));
    setTaskText(data.tasks.join("\n"));
    setStudentPassword(data.studentPassword);
    setTeacherPassword(data.teacherPassword);
    setMessage("");
  }, [activeClass, data]);

  React.useEffect(() => {
    if (!session || !activeClass) return;

    socket.emit("join-class", activeClass);

    const handleStatusUpdated = (payload: {
      className: string;
      studentName: string;
      taskName: string;
      status: StatusColor;
    }) => {
      setClasses((prev) => {
        const currentClass = prev[payload.className];
        if (!currentClass) return prev;

        return {
          ...prev,
          [payload.className]: {
            ...currentClass,
            grid: {
              ...currentClass.grid,
              [payload.studentName]: {
                ...(currentClass.grid?.[payload.studentName] ?? {}),
                [payload.taskName]: payload.status,
              },
            },
          },
        };
      });

      if (payload.className === activeClass) {
        addToast(`${payload.studentName} → ${payload.taskName}`);
      }
    };

    const handleStatusControlsUpdated = (payload: {
      className: string;
      enabled: boolean;
    }) => {
      setClasses((prev) => {
        const currentClass = prev[payload.className];
        if (!currentClass) return prev;

        return {
          ...prev,
          [payload.className]: {
            ...currentClass,
            statusControlsEnabled: payload.enabled,
          },
        };
      });

      if (payload.className === activeClass) {
        addToast(
          payload.enabled ? "Bollen geactiveerd." : "Bollen gedeactiveerd."
        );
      }
    };

    const handleClassesChanged = async () => {
      try {
        await reloadClasses();
      } catch (err) {
        console.error("classes-changed fout", err);
      }
    };

    socket.on("status-updated", handleStatusUpdated);
    socket.on("status-controls-updated", handleStatusControlsUpdated);
    socket.on("classes-changed", handleClassesChanged);

    return () => {
      socket.emit("leave-class", activeClass);
      socket.off("status-updated", handleStatusUpdated);
      socket.off("status-controls-updated", handleStatusControlsUpdated);
      socket.off("classes-changed", handleClassesChanged);
    };
  }, [session, activeClass, addToast, reloadClasses]);

  const updateSessionForClass = React.useCallback((className: string) => {
    setSelectedClass(className);
    setAdminSelectedClass(className);

    setSession((prev) =>
      prev
        ? {
            ...prev,
            class: className,
            expiresAt: Date.now() + SESSION_DURATION_MS,
          }
        : prev
    );
  }, []);

  const handleLogin = async () => {
    const availableClasses = Object.keys(classes);
    const safeSelectedClass =
      selectedClass && classes[selectedClass]
        ? selectedClass
        : availableClasses[0];

    if (!safeSelectedClass || !classes[safeSelectedClass]) {
      setError("Klas niet gevonden");
      return;
    }

    const currentClass = classes[safeSelectedClass];

    try {
      if (role === "admin") {
        await adminLogin(password);
      } else if (role === "teacher") {
        if (password !== currentClass.teacherPassword) {
          throw new Error("Fout wachtwoord");
        }
      } else {
        if (password !== currentClass.studentPassword) {
          throw new Error("Fout wachtwoord");
        }
      }

      setSession({
        role,
        class: safeSelectedClass,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      });

      setSelectedClass(safeSelectedClass);
      setAdminSelectedClass(safeSelectedClass);
      setError("");
      setPassword("");
    } catch {
      setError("Fout wachtwoord");
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setSession(null);
    setPassword("");
    setError("");
    setTeacherTab("none");
    setMessage("");
  };

  const runAction = React.useCallback(
    async (action: () => Promise<void>, successMessage?: string) => {
      try {
        setIsSaving(true);
        await action();

        if (successMessage) {
          setMessage(successMessage);
          addToast(successMessage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    },
    [addToast]
  );

  const setStatusControls = async (enabled: boolean) => {
    await runAction(
      async () => {
        await saveStatusControls({
          className: activeClass,
          enabled,
        });

        setClasses((prev) => ({
          ...prev,
          [activeClass]: {
            ...prev[activeClass],
            statusControlsEnabled: enabled,
          },
        }));
      },
      enabled ? "Bollen geactiveerd." : "Bollen gedeactiveerd."
    );
  };

  const renameClass = async () => {
    const trimmed = renameClassName.trim();

    if (!trimmed) {
      setMessage("Geef een klasnaam in.");
      return;
    }

    if (trimmed === activeClass) {
      setMessage("Geen wijziging nodig.");
      return;
    }

    await runAction(async () => {
      await renameClassApi({
        oldName: activeClass,
        newName: trimmed,
      });

      const fresh = await reloadClasses();

      if (!fresh[trimmed]) {
        throw new Error("Nieuwe klas ontbreekt na hernoemen");
      }

      updateSessionForClass(trimmed);
    }, "Klasnaam gewijzigd.");
  };

  const addClass = async () => {
    const trimmed = newClassName.trim();

    if (!trimmed) {
      setMessage("Geef een naam voor de nieuwe klas.");
      return;
    }

    await runAction(async () => {
      await addClassApi({
        name: trimmed,
        studentPassword: "1234",
        teacherPassword: "abcd",
      });

      await reloadClasses();
      updateSessionForClass(trimmed);
      setNewClassName("");
    }, "Nieuwe klas toegevoegd.");
  };

  const saveStudents = async () => {
    await runAction(async () => {
      await saveStudentsApi({
        className: activeClass,
        students: parseLines(studentText),
      });
      await reloadClasses();
    }, "Leerlingen opgeslagen.");
  };

  const saveTasks = async () => {
    await runAction(async () => {
      await saveTasksApi({
        className: activeClass,
        tasks: parseLines(taskText),
      });
      await reloadClasses();
    }, "Taken opgeslagen.");
  };

  const savePasswords = async () => {
    await runAction(async () => {
      await savePasswordsApi({
        className: activeClass,
        studentPassword,
        teacherPassword,
      });
      await reloadClasses();
    }, "Wachtwoorden opgeslagen.");
  };

  const resetGrid = async () => {
    if (!data) return;

    await runAction(async () => {
      await Promise.all(
        data.students.flatMap((student) =>
          data.tasks.map((task) =>
            saveStatus({
              className: activeClass,
              studentName: student,
              taskName: task,
              status: "red",
            })
          )
        )
      );

      await reloadClasses();
    }, "Rooster gereset.");
  };

  const updateStatus = async (student: string, task: string) => {
    if (!session) return;

    if (session.role === "student" && !statusControlsEnabled) return;

    const current = classes[activeClass];
    if (!current) return;

    const currentGrid = createGrid(
      current.students,
      current.tasks,
      current.grid
    );

    const currentStatus = (currentGrid[student]?.[task] ??
      "red") as StatusColor;

    const nextStatus: StatusColor =
      currentStatus === "red"
        ? "green"
        : currentStatus === "green"
        ? "orange"
        : "red";

    try {
      await saveStatus({
        className: activeClass,
        studentName: student,
        taskName: task,
        status: nextStatus,
      });

      setClasses((prev) => ({
        ...prev,
        [activeClass]: {
          ...prev[activeClass],
          grid: {
            ...prev[activeClass].grid,
            [student]: {
              ...(prev[activeClass].grid?.[student] ?? {}),
              [task]: nextStatus,
            },
          },
        },
      }));

      addToast(`${student} → ${task}`);
    } catch (err) {
      console.error("updateStatus fout", err);
      addToast("Opslaan mislukt.");
      await reloadClasses();
    }
  };

  const statusSummary = React.useMemo(() => {
    if (!data) return { red: 0, green: 0, orange: 0 };

    return data.students.reduce(
      (acc, student) => {
        data.tasks.forEach((task) => {
          const status = (grid?.[student]?.[task] ?? "red") as StatusColor;
          acc[status] += 1;
        });
        return acc;
      },
      { red: 0, green: 0, orange: 0 }
    );
  }, [data, grid]);

  const roleLabel =
    session?.role === "teacher"
      ? "Leerkracht"
      : session?.role === "admin"
      ? "Admin"
      : "Leerling";

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: NOVA_THEME.bg,
          fontFamily: "Arial, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#444",
        }}
      >
        Laden...
      </div>
    );
  }

  if (!session) {
    return (
      <SplashLogin
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        role={role}
        setRole={setRole}
        password={password}
        setPassword={setPassword}
        error={error}
        onLogin={handleLogin}
      />
    );
  }

  if (!data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: NOVA_THEME.bg,
          fontFamily: "Arial, sans-serif",
          padding: 24,
        }}
      >
        <AppHeader
          pageColor={pageColor}
          setPageColor={setPageColor}
          onLogout={logout}
          toastsEnabled={toastsEnabled}
          setToastsEnabled={setToastsEnabled}
          showStatusDisabledBadge={false}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "24px auto 0",
            background: "white",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #E4DEC0",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          }}
        >
          Geen klas gevonden.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: NOVA_THEME.bg,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <AppHeader
        pageColor={pageColor}
        setPageColor={setPageColor}
        onLogout={logout}
        toastsEnabled={toastsEnabled}
        setToastsEnabled={setToastsEnabled}
        showStatusDisabledBadge={
          session.role === "student" && !statusControlsEnabled
        }
      />

      <div
        style={{
          maxWidth: 1180,
          margin: "-60px auto 0",
          padding: "0 24px",
          position: "relative",
          zIndex: 20,
        }}
      >
        <ClassSummary
          activeClass={activeClass}
          roleLabel={roleLabel}
          red={statusSummary.red}
          green={statusSummary.green}
          orange={statusSummary.orange}
        />
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 24px 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {session.role === "admin" && (
          <div
            style={{
              marginBottom: 20,
              background: "white",
              borderRadius: 28,
              padding: 22,
              border: "1px solid #E4DEC0",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 700,
                color: "#333",
              }}
            >
              Beheer klas
            </label>

            <select
              value={adminSelectedClass}
              onChange={(e) => setAdminSelectedClass(e.target.value)}
              style={{
                width: "100%",
                maxWidth: 360,
                padding: 13,
                borderRadius: 14,
                border: "1px solid #E4DEC0",
                background: "white",
                fontSize: 15,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        )}

        {(session.role === "teacher" || session.role === "admin") && (
          <TeacherPanel
            role={session.role}
            teacherTab={teacherTab}
            setTeacherTab={setTeacherTab}
            selectedClass={activeClass}
            renameClassName={renameClassName}
            setRenameClassName={setRenameClassName}
            newClassName={newClassName}
            setNewClassName={setNewClassName}
            studentText={studentText}
            setStudentText={setStudentText}
            taskText={taskText}
            setTaskText={setTaskText}
            studentPassword={studentPassword}
            setStudentPassword={setStudentPassword}
            teacherPassword={teacherPassword}
            setTeacherPassword={setTeacherPassword}
            statusControlsEnabled={statusControlsEnabled}
            onSetStatusControlsEnabled={setStatusControls}
            onRenameClass={renameClass}
            onAddClass={addClass}
            onSaveStudents={saveStudents}
            onSaveTasks={saveTasks}
            onSavePasswords={savePasswords}
            onResetGrid={resetGrid}
            message={isSaving ? "Bezig met opslaan..." : message}
          />
        )}

        <RosterTable
          data={data}
          grid={grid}
          updateStatus={updateStatus}
          canInteract={canInteractWithDots}
          dotsDisabledForStudents={!statusControlsEnabled}
          role={session.role}
        />

        <div
          style={{
            marginTop: 40,
            padding: "16px 0 20px",
            textAlign: "center",
            fontSize: 11,
            color: "rgba(60,60,60,0.55)",
            fontWeight: 700,
            letterSpacing: 0.6,
            opacity: 0.7,
          }}
        >
          © Matter
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
