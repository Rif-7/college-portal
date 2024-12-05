export function generateInitialSchedule(refField) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const schedule = {};

  days.forEach((day) => {
    const periodCount = day === "friday" ? 6 : 7;
    schedule[day] = Array(periodCount).fill({
      subjectCode: "",
      [refField]: null,
    });
  });

  return schedule;
}

export const departments = [
  "Computer Science",
  "Mechanical",
  "Civil",
  "Electrical",
];

export const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
