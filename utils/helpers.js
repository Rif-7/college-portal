import ClassTimeTable from "../models/ClassTimeTable";

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

export async function updateClassTT(
  classID,
  day,
  period,
  subjectCode,
  tutorID
) {
  try {
    const classDoc = await ClassTimeTable.find({ class: classID });
    if (!classDoc) {
      return { code: 404, error: "Class time table not found" };
    }
  } catch (err) {
    console.log(err);
    return {
      code: 500,
      error: "An unexpected error occured while updating class time table",
    };
  }
}

export const departments = [
  "Computer Science",
  "Mechanical",
  "Civil",
  "Electrical",
];

export const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

export const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
