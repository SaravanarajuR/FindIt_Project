const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const Otp = require("../models/otpModel");

router.get("/", (req, res) => {
  const message = req.flash("m");
  res.render("verify", {
    message,
  });
});

router.post("/", (req, res) => {
  Otp.find({
    mail: req.body.mail,
  }).then((f) => {
    if (f.length === 0) {
      User.findOneAndRemove({
        emairl: req.body.mail,
      }).then((f) => {});
      req.flash("message", [req.body.mail, "OTP expired try signing up again"]);
      res.redirect("/signup");
    } else {
      if (req.body.otp === f[0].otp) {
        User.findOneAndUpdate(
          {
            email: req.body.mail,
          },
          {
            verified: "TRUE",
          }
        ).then((f) => {
          res.redirect("/home");
        });
      } else {
        User.findOneAndRemove({
          email: req.body.mail,
        }).then((f) => {});
        req.flash("message", [req.body.mail, "OTP does not match try again"]);
        res.redirect("/signup");
      }
    }
  });
});

module.exports = router;
