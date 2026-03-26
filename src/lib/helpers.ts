type StatusColor = "red" | "green" | "orange";

type Grid = Record<string, Record<string, StatusColor>>;

export function createGrid(
  students: string[],
  tasks: string[],
  existingGrid: Grid = {}
): Grid {
  const nextGrid: Grid = {};

  students.forEach((student) => {
    nextGrid[student] = {};

    tasks.forEach((task) => {
      const existingValue = existingGrid?.[student]?.[task];

      nextGrid[student][task] =
        existingValue === "green" || existingValue === "orange"
          ? existingValue
          : "red";
    });
  });

  return nextGrid;
}
