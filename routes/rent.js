const express = require("express");
const router = express.Router();

const Home = require("../models/homeModel");

function findLength() {
  const count = Home.count({});
  return count;
}
function filterLength(city, rate, qual, type) {
  const count = Home.count({
    regio1: city,
    Rating: rate,
    interiorQuality: qual,
    typeOfFlat: type,
  });
  return count;
}

function searchLength(url) {
  const count = Home.count({
    $text: { $search: url },
  });
  return count;
}

router.get("/", async function (req, res) {
  if (req.session.isAuthenticated) {
    if (!req.query.search && !req.query.filter) {
      const page = Number(req.query.page) || 1;
      const contentPerPage = 20;
      const toSkip = (page - 1) * contentPerPage;
      Home.find()
        .where("totalRent")
        .ne("NA")
        .where("totalRent")
        .ne("0")
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
            filters: [],
          });
        });
    } else if (req.query.search != null) {
      const page = Number(req.query.page) || 1;
      const contentPerPage = 20;
      const toSkip = (page - 1) * contentPerPage;
      Home.find({
        $text: { $search: req.query.search },
      })
        .where("totalRent")
        .ne("NA")
        .where("totalRent")
        .ne("0")
        .skip(toSkip)
        .limit(contentPerPage)
        .then(async function (f) {
          f.sort((a, b) => {
            if (a.Rating >= b.Rating) return 1;
            if (a.Rating < b.Rating) return -1;
            else return 0;
          }).reverse();
          if (f) {
            const totalCount = Math.ceil(
              (await searchLength(req.query.search)) / 20
            );
            res.render("rent", {
              home: f,
              page: req.query.page || 1,
              total: totalCount,
              url: req.query.search,
              filters: [],
            });
          }
        });
    } else if (req.query.filter != null) {
      const page = Number(req.query.page) || 1;
      const contentPerPage = 20;
      const toSkip = (page - 1) * contentPerPage;
      const arr = req.query.filter.split(",");
      Home.find({
        regio1: arr[0],
        Rating: arr[1],
        interiorQuality: arr[2],
        typeOfFlat: arr[3],
      })
        .where("totalRent")
        .ne("NA")
        .where("totalRent")
        .ne("0")
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
            filters: req.query.filter,
          });
        });
    } else {
      res.render("rent", { home: [] });
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/", async function (req, res) {
  const page = Number(req.query.page) || 1;
  const contentPerPage = 20;
  const toSkip = (page - 1) * contentPerPage;

  //filtering
  Home.find({
    regio1: req.body.city,
    Rating: req.body.rate,
    interiorQuality: req.body.quality,
    typeOfFlat: req.body.type,
  })
    .where("totalRent")
    .ne("NA")
    .where("totalRent")
    .ne("0")
    .skip(toSkip)
    .limit(contentPerPage)
    .then(async (f) => {
      f.sort((a, b) => {
        if (a.Rating >= b.totalRent) return 1;
        if (a.Rating < b.totalRent) return -1;
        else return 0;
      }).reverse();
      const totalCount = await filterLength(
        req.body.city,
        req.body.rate,
        req.body.quality,
        req.body.type
      );
      const fil = [
        req.body.city,
        req.body.rate,
        req.body.quality,
        req.body.type,
      ];
      res.render("rent", {
        home: f,
        page: req.query.page || 1,
        total: totalCount,
        url: "",
        filters: fil,
      });
    });
});

module.exports = router;
