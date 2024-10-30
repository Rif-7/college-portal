const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstname: { type: String, minLength: 3, maxLength: 20 },
  lastname: { type: String, minLength: 3, maxLength: 20 },
  rollno: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
});

module.exports = mongoose.Schema("Student", StudentSchema);
