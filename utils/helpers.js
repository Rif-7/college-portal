const mongoose = require("mongoose");

const departments = ["Computer Science", "Mechanical", "Civil", "Electrical"];

const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function generateInitialSchedule(refField) {
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

function isValidMongoID(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

function getTutorSubjects(timetable) {
  const subjects = new Set();
  for (const day in days) {
    const periods = timetable[day];
    for (const period of periods) {
      if (period.subjectCode) {
        subjects.add(period.subjectCode);
      }
    }
  }
  return Array.from(subjects);
}

async function getTutorClasses(timetable) {
  const classes = [];
  const seenClasses = newSet();

  for (const day in days) {
    const periods = timetable[day];
    for (const period in periods) {
      if (period.class) {
        if (!seenClasses.has(period.class.toString())) {
          seenClasses.add(period.class.toString());
          classes.push(period.class);
        }
      }
    }
  }
  return classes;
}

module.exports = {
  departments,
  semesters,
  days,
  generateInitialSchedule,
  isValidMongoID,
  getTutorSubjects,
  getTutorClasses,
};
