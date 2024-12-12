const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TutorTimeTableSchema = new Schema({
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor", required: true },
  schedule: {
    monday: [
      {
        subjectCode: { type: String },
        class: { type: Schema.Types.ObjectId, ref: "Class" },
      },
    ],
    tuesday: [
      {
        subjectCode: { type: String },
        class: { type: Schema.Types.ObjectId, ref: "Class" },
      },
    ],
    wednesday: [
      {
        subjectCode: { type: String },
        class: { type: Schema.Types.ObjectId, ref: "Class" },
      },
    ],
    thursday: [
      {
        subjectCode: { type: String },
        class: { type: Schema.Types.ObjectId, ref: "Class" },
      },
    ],
    friday: [
      {
        subjectCode: { type: String },
        class: { type: Schema.Types.ObjectId, ref: "Class" },
      },
    ],
  },
});

TutorTimeTableSchema.virtual("populatedSchedule").get(async function () {
  const populated = await this.populate({
    path: `
      schedule.monday.class
      schedule.tuesday.class
      schedule.wednesday.class
      schedule.thursday.class
      schedule.friday.class
    `,
    select: "batch semester department",
  }).execPopulate();

  return populated.schedule;
});

module.exports = mongoose.model("TutorTimeTable", TutorTimeTableSchema);
