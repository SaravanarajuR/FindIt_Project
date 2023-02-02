const express = require("express");
const Otp = require("../models/otpModel");

const changeOtp = function resetOtp(gmail, otp) {
  Otp.findOneAndUpdate(
    {
      mail: gmail,
    },
    {
      otp: otp,
    }
  ).then((f) => {});
};

module.exports = { changeOtp };
