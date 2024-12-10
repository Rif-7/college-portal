const mongoose = require("mongoose");

function generateInitialSchedule(refField) {
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

function isValidMongoID(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

const departments = ["Computer Science", "Mechanical", "Civil", "Electrical"];

const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

module.exports = {
  generateInitialSchedule,
  isValidMongoID,
  departments,
  semesters,
  days,
};
