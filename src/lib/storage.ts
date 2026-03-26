import type { SchoolClass, SessionType, ThemeColorKey } from "./types";

export const STORAGE_KEY_CLASSES = "nu4p_classes";
export const STORAGE_KEY_SESSION = "nu4p_session";
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const defaultClasses: Record<string, SchoolClass> = {
  "Klas A": {
    students: ["Emma", "Liam"],
    tasks: ["Lezen", "Rekenen"],
    grid: {},
    studentPassword: "1234",
    teacherPassword: "abcd",
  },
};

export function parseLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getStoredSession(): SessionType {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt) return null;

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getStoredClasses(): Record<string, SchoolClass> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (!raw) return defaultClasses;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : defaultClasses;
  } catch {
    return defaultClasses;
  }
}

export function getStoredPageColor(key: string): ThemeColorKey {
  try {
    const value = localStorage.getItem(key);
    if (
      value === "peach" ||
      value === "yellow" ||
      value === "blue" ||
      value === "green"
    ) {
      return value;
    }
    return "peach";
  } catch {
    return "peach";
  }
}
