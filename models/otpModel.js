const mongoose = require("mongoose");

const otpSchema = {
  mail: {
    type: String,
    unique: true,
  },
  otp: String,
  created: { type: Date, expires: "5m", default: Date.now },
};

module.exports = mongoose.model("Otp", otpSchema);
