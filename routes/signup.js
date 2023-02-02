const express = require("express");
const router = express.Router();

//controllers

const signup = require("../controllers/signup");

router.get("/", signup.get);

router.post("/", signup.post);

module.exports = router;
