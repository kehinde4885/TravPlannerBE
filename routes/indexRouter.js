// Start another Express app
const express = require("express");
const fs = require("fs");

const countryData = require("../MynewFile4.json");

const {getCities, getCountryInfo} = require('../helpers/utils')

const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  console.log(req.query.country);

  let country = countryData.find((e) => {
    return e.name.toLowerCase() === req.query.country.toLowerCase();
  });

  country.getInfo = getCountryInfo;
  country.getCities = getCities;

  const countryInfo = country.getInfo();

  res.render("index", {
    country: country.name.toUpperCase(),
    info: countryInfo,
    categories: [
      "Flights",
      "Hotels & Rooms",
      "Weather",
      "Events",
      "Attractions",
    ],
  });
});

//export Express app

module.exports = indexRouter;
