const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
  batch: { type: String },
  semester: {
    type: String,
    enum: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"],
    required: true,
  },
  department: {
    type: String,
    enum: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    required: true,
  },
});

TutorSchema.virtual("timetable", {
  ref: "ClassTimeTable",
  localField: "_id",
  foreignField: "class",
  justOne: true,
});

module.exports = mongoose.model("Class", ClassSchema);
