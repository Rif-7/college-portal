const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 15 },
  password: { type: String, required: true, minLength: 6, maxLength: 30 },
  userType: { type: String, enum: ["tutor", "student"] },
});

module.exports = mongoose.model("User", UserSchema);
