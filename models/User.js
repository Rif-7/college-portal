const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 15 },
  password: { type: String, required: true, minLength: 6, maxLength: 30 },
  userType: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
