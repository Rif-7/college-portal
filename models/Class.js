const mongoose = require("mongoose");
const { departments, semesters } = require("../utils/helpers");

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
  batch: { type: String },
  semester: {
    type: String,
    enum: semesters,
    required: true,
  },
  department: {
    type: String,
    enum: departments,
    required: true,
  },
});

ClassSchema.virtual("timetable", {
  ref: "ClassTimeTable",
  localField: "_id",
  foreignField: "class",
  justOne: true,
});

module.exports = mongoose.model("Class", ClassSchema);
