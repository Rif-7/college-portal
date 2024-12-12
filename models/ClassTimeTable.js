const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassTimeTableSchema = new Schema({
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  schedule: {
    monday: [
      {
        subjectCode: { type: String },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
      },
    ],
    tuesday: [
      {
        subjectCode: { type: String },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
      },
    ],
    wednesday: [
      {
        subjectCode: { type: String },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
      },
    ],
    thursday: [
      {
        subjectCode: { type: String },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
      },
    ],
    friday: [
      {
        subjectCode: { type: String },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
      },
    ],
  },
});

ClassTimeTableSchema.virtual("populatedSchedule").get(async function () {
  const populated = await this.populate({
    path: `
      schedule.monday.tutor
      schedule.tuesday.tutor
      schedule.wednesday.tutor
      schedule.thursday.tutor
      schedule.friday.tutor
    `,
    select: "firstname lastname",
  }).execPopulate();

  return populated.schedule;
});

module.exports = mongoose.model("ClassTimeTable", ClassTimeTableSchema);
