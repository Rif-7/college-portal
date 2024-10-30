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

module.exports = mongoose.model("TutorTimeTable", TutorTimeTableSchema);
