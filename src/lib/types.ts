export type UserRole = "student" | "teacher" | "admin";
export type TeacherTab = "class" | "students" | "tasks" | "passwords" | "none";
export type StatusColor = "red" | "green" | "orange";
export type ThemeColorKey = "peach" | "yellow" | "blue" | "green";

export type Grid = Record<string, Record<string, StatusColor>>;

export type SchoolClass = {
  students: string[];
  tasks: string[];
  grid: Grid;
  studentPassword: string;
  teacherPassword: string;
  statusControlsEnabled: boolean;
};

export type SessionType = {
  role: UserRole;
  class: string;
  expiresAt: number;
} | null;
