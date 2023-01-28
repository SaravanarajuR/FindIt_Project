const express = require("express");
const router = express.Router();

const Home = require("../models/homeModel");

router.get("/", (req, res) => {
  let rand = Math.floor(Math.random() * 50000);
  if (req.session.isAuthenticated) {
    Home.find()
      .where("scoutId")
      .gt(rand)
      .lt(rand + 4)
      .then((f) => {
        res.render("home", { home: f });
      });
  } else {
    res.redirect("/login");
  }
});

router.post("/", (req, res) => {
  const home1 = new Home({
    regio1: req.body.city,
    serviceCharge: req.body.servicecharge,
    street: req.body.street,
    typeOfFlat: req.body.type,
    lift: req.body.lift,
    garden: req.body.garden,
    yearConstructed: req.body.year,
    lastRefurbish: req.body.refurbish,
    totalRent: req.body.rent,
    mail: req.body.contact,
    scoutId: req.file.filename,
    Rating: Math.floor(Math.random() * 5) + 1,
  });
  home1.save();
  res.redirect("/home");
});

module.exports = router;
