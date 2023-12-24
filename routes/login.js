const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");
const Otp = require("../models/otpModel");

function resetOtp(gmail, otp) {
  Otp.findOneAndUpdate(
    {
      mail: gmail,
    },
    {
      otp: otp,
    }
  ).then((f) => {});
}

router.get("/", (req, res) => {
  function generateCaptcha() {
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      let textcase = Math.round(Math.random()) ? 65 : 97;
      captcha += String.fromCharCode(Math.floor(Math.random() * 25) + textcase);
    }
    return captcha;
  }

  const p = req.flash("n");

  res.render("signup", {
    p: p,
    captcha: generateCaptcha(),
  });
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.mail,
    });
    if (user && user.verified === "TRUE") {
      const cmp = await bcrypt.compare(req.body.pass, user.password);
      if (cmp) {
        req.session.isAuthenticated = true;
        res.redirect("/home");
      } else {
        req.flash("n", "Incorrect password");
        res.redirect("/login");
      }
    } else if (user && user.verified === "FALSE") {
      Otp.find({
        mail: req.body.mail,
      }).then((foundOtp) => {
        const createdOtp = Math.floor(1000 + Math.random() * 9999);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "testmailplm00@gmail.com",
            pass: process.env.mailpass,
          },
        });

        let info = transporter.sendMail({
          from: "FindIt@gmail.com",
          to: req.body.mail,
          subject: "FindIt Registration",
          html: `<h1> ${createdOtp} is your OTP for registering</h1><h4>Please do not share</h4>`,
        });
        if (foundOtp.length === 0) {
          const ver = new Otp({
            mail: req.body.mail,
            otp: createdOtp,
            created: Date.now(),
          });
          ver.save();
          req.flash("m", [req.body.mail, "You are not verified yet"]);
          res.redirect("/verify");
        } else {
          resetOtp(req.body.mail, createdOtp);
          req.flash("m", [req.body.mail, "You are not verified yet"]);
          res.redirect("/verify");
        }
      });
    } else {
      req.flash("n", "mail id does not exists");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
