const express = require("express");
const router = express.Router();

const Home = require("../models/homeModel");

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    const id = req.params.id;
    Home.findOne({ _id: id.substring(1) }, function (err, found) {
      let m = found;
      let foundCity = found.regio1;
      let rate = found.Rating;
      let rent = found.totalRent;
      Home.find({ regio1: foundCity })
        .where("totalRent")
        .lt(rent)
        .ne("0")
        .where("Rating")
        .gte(rate)
        .then((f2) => {
          let s2 = f2;
          s2.sort((a, b) => {
            if (a.totalRent >= b.totalRent) {
              return 1;
            } else if (a.totalRent < b.totalRent) {
              return -1;
            } else if (a.totalRent === "NA" || b.totalRent == "NA") {
              return -1;
            } else {
              return 0;
            }
          }).reverse();
          let c = s2.slice(0, 20);
          res.render("product", { home: m, ext: c });
        });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
