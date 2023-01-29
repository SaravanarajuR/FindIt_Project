const express = require("express");
const router = express.Router();

const Home = require("../models/homeModel");

function findLength() {
  const count = Home.count({});
  return count;
}

router.get("/", async function (req, res) {
  if (req.session.isAuthenticated) {
    if (!req.query.search) {
      const page = Number(req.query.page) || 1;
      const contentPerPage = 20;
      const toSkip = (page - 1) * contentPerPage;
      Home.find()
        .skip(toSkip)
        .limit(contentPerPage)
        .then(async (found) => {
          found
            .sort((a, b) => {
              if (a.Rating >= b.Rating) return 1;
              if (a.Rating < b.Rating) return -1;
              else return 0;
            })
            .reverse();
          const totalPages = Math.ceil(100 / 20);
          res.render("rent", {
            home: found,
            page: req.query.page || 1,
            total: await findLength(),
            url: "",
          });
        });
    } else {
      const page = Number(req.query.page) || 1;
      const contentPerPage = 20;
      const toSkip = (page - 1) * contentPerPage;
      Home.find({
        $text: { $search: req.query.search },
      })
        .skip(toSkip)
        .limit(contentPerPage)
        .then((f) => {
          f.sort((a, b) => {
            if (a.Rating >= b.Rating) return 1;
            if (a.Rating < b.Rating) return -1;
            else return 0;
          }).reverse();
          const totalCount = f.length / 20;
          if (f) {
            res.render("rent", {
              home: f,
              page: req.query.page || 1,
              total: totalCount,
              url: req.query.search,
              filter: "false",
            });
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
  const page = Number(req.query.page) || 1;
  const contentPerPage = 20;
  const toSkip = (page - 1) * contentPerPage;
  Home.find({
    regio1: req.body.city,
    Rating: req.body.rate,
    interiorQuality: req.body.quality,
    typeOfFlat: req.body.type,
  })
    .skip(toSkip)
    .limit(contentPerPage)
    .then((f) => {
      f.sort((a, b) => {
        if (a.Rating >= b.totalRent) return 1;
        if (a.Rating < b.totalRent) return -1;
        else return 0;
      }).reverse();
      const totalCount = f.length;
      res.render("rent", {
        home: f,
        page: req.query.page || 1,
        total: totalCount,
        url: "",
      });
    });
});

module.exports = router;
