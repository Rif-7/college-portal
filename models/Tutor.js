const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstname: { type: String, minLength: 1, maxLength: 20 },
  lastname: { type: String, minLength: 1, maxLength: 20 },
});

TutorSchema.virtual("timetable", {
  ref: "TutorTimeTable",
  localField: "_id",
  foreignField: "tutor",
  justOne: true,
});

TutorSchema.set("toObject", { virtuals: true });
TutorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Tutor", TutorSchema);
