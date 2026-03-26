const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://nu4p-backend-production-7cea.up.railway.app";

if (!API_URL) {
  throw new Error("REACT_APP_API_URL ontbreekt");
}

export type StatusColor = "red" | "green" | "orange";

export type SchoolClassApi = {
  id?: string;
  name: string;
  studentPassword: string;
  teacherPassword: string;
  students: string[];
  tasks: string[];
  grid: Record<string, Record<string, StatusColor>>;
  statusControlsEnabled: boolean;
};

export async function adminLogin(password: string) {
  const response = await fetch(`${API_URL}/auth/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Admin login mislukt");
  }

  return response.json();
}

export async function fetchClasses(): Promise<Record<string, SchoolClassApi>> {
  const response = await fetch(`${API_URL}/classes`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Kon klassen niet ophalen: ${text}`);
  }

  const classes: SchoolClassApi[] = await response.json();

  return Object.fromEntries(
    classes.map((schoolClass) => [schoolClass.name, schoolClass])
  );
}

export async function saveStatus(params: {
  className: string;
  studentName: string;
  taskName: string;
  status: StatusColor;
}) {
  const response = await fetch(`${API_URL}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kon status niet opslaan: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

export async function saveStatusControls(params: {
  className: string;
  enabled: boolean;
}) {
  const response = await fetch(`${API_URL}/classes/status-controls`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Kon bol-instelling niet opslaan: ${response.status} ${text}`
    );
  }

  return JSON.parse(text);
}

export async function addClass(params: {
  name: string;
  studentPassword?: string;
  teacherPassword?: string;
}) {
  const response = await fetch(`${API_URL}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kon klas niet toevoegen: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

export async function renameClass(params: {
  oldName: string;
  newName: string;
}) {
  const response = await fetch(`${API_URL}/classes/rename`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kon klas niet hernoemen: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

export async function saveStudents(params: {
  className: string;
  students: string[];
}) {
  const response = await fetch(`${API_URL}/classes/students`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kon leerlingen niet opslaan: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

export async function saveTasks(params: {
  className: string;
  tasks: string[];
}) {
  const response = await fetch(`${API_URL}/classes/tasks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Kon taken niet opslaan: ${response.status} ${text}`);
  }

  return JSON.parse(text);
}

export async function savePasswords(params: {
  className: string;
  studentPassword: string;
  teacherPassword: string;
}) {
  const response = await fetch(`${API_URL}/classes/passwords`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Kon wachtwoorden niet opslaan: ${response.status} ${text}`
    );
  }

  return JSON.parse(text);
}
