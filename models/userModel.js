const mongoose = require("mongoose");

const userSchema = {
  email: {
    type: String,
    unique: true,
  },
  password: String,
  verified: String,
};

module.exports = mongoose.model("User", userSchema);
