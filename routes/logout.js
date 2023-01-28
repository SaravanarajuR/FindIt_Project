const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/userModel");

router.get("/", (req, res) => {
  req.session.isAuthenticated = false;
  res.redirect("/signup");
});

module.exports = router;
