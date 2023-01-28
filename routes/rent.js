const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
const flash = require("connect-flash");

const Home = require("../models/homeModel");

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    if (!req.query.search) {
      let rand = Math.floor(Math.random() * 10000);
      Home.find()
        .where("scoutId")
        .gt(rand)
        .lt(rand + 21)
        .then((found) => {
          found
            .sort((a, b) => {
              if (a.Rating >= b.Rating) return 1;
              if (a.Rating < b.Rating) return -1;
              else return 0;
            })
            .reverse();
          res.render("rent", { home: found });
        });
    } else {
      Home.find({
        $text: { $search: req.query.search },
      })
        .limit(100)
        .then((f) => {
          f.sort((a, b) => {
            if (a.Rating >= b.Rating) return 1;
            if (a.Rating < b.Rating) return -1;
            else return 0;
          }).reverse();
          if (f) {
            res.render("rent", { home: f.slice(0, 20) });
          } else {
            res.render("rent", { home: [] });
          }
        });
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/", (req, res) => {
  Home.find({
    regio1: req.body.city,
    Rating: req.body.rate,
    interiorQuality: req.body.quality,
    typeOfFlat: req.body.type,
  }).then((f) => {
    f = f.slice(1, 20);
    f.sort((a, b) => {
      if (a.Rating >= b.totalRent) return 1;
      if (a.Rating < b.totalRent) return -1;
      else return 0;
    }).reverse();
    res.render("rent", { home: f.slice(0, 20) });
  });
});

module.exports = router;
