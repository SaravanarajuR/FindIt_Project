const express = require("express");
const router = express.Router();

const Home = require("../models/homeModel");

const predict = require("../controllers/prediction");

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    const id = req.query.id;
    Home.findOne({ _id: id }, async function (err, found) {
      let foundCity = found.regio1;
      let rate = found.Rating;
      let rent = found.totalRent;
      let p = await predict(found.totalRent, found.typeOfFlat, found.regio1);
      Home.find({ regio1: foundCity })
        .where("totalRent")
        .lt(rent)
        .where("Rating")
        .gte(rate)
        .then(async (f2) => {
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
          res.render("product", { home: found, ext: c, p });
        });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
