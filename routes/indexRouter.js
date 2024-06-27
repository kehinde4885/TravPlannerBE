require("dotenv").config();

// Start another Express app
const express = require("express");
const fs = require("fs");

const countryData = require("../MynewFile4.json");

const flights = require("../mockFlights.json");

const { getCities, getCountryInfo } = require("../helpers/utils");

const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
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

indexRouter.get("/:country/:Info", async (req, res) => {
  const ip = req.ip;
  req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  try {
    // const origin = await getOriginWithIP(ip);
    // const destination = req.params.country;

    // let capital = countryData.find((e) => {
    //   return destination === e.name.toUpperCase();
    // }).capital;

    // console.log(`Searching flights for ${origin.city} to ${capital}`);

    const origin = await getOriginWithIP(ip);
    const destination = {
      city: getCapital(req.params.country),
      country: req.params.country,
    };

    console.log(`Searching flights for ${origin.city} to ${destination.city}`);

    //getEntityID(origin);
    //getEntityID(destination);

    console.log(flights.data.itineraries[0].legs);

    const data = flights.data.itineraries.map((e) => {
      return {
        price: e.price.formatted,
        origin: `${e.legs[0].origin.city}, ${e.legs[0].origin.country}`,
        destination: `${e.legs[0].destination.city}, ${e.legs[0].destination.country}`,
        carrier: e.legs[0].carriers.marketing[0].name,
      };
    });
    res.render("flights", { flights: data });
  } catch (error) {
    console.log("an Error HAHA", error);
  }

  //Search round Trip Flights

  //res.send("Hello World");
});

//export Express app
module.exports = indexRouter;

async function getFlights() {
  const url =
    "https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=DXB&toEntityId=NG";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c36cdd5a8bmshfd6196790e8e7b9p13a4cbjsn0a9073a4e027",
      "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
    },
  };
}

async function getOriginWithIP(ip) {
  // get Location name from Abstract API
  // Use Environment Variables for API Keys
  const apiKey = process.env.ABSTRACT_GEOKEY;
  const baseUrl = "https://ipgeolocation.abstractapi.com/v1";

  //For PRoduction only
  // Convert Ip to String
  //const url = `${baseUrl}?api_key=${apiKey}&ip_address=${ip.toString()}`

  // for Development
  const url = `${baseUrl}?api_key=${apiKey}&ip_address=${"102.89.23.78"}`;

  let response = await fetch(url);
  let location = await response.json();

  const origin = { city: location.city, country: location.country };

  console.log(origin);
  return origin;
}

//Get Entity ID
async function getEntityID(location) {
  const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${location}&placeTypes=COUNTRY`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.SKY_SCANNER}`,
      "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
    },
  };

  let dataPromise = await fetch(url, options);
  let data = await dataPromise.json();

  console.log(data);

  console.log(data.data[0].presentation.skyId);

  return data.data[0].presentation.skyId;
}

// Get Capital
function getCapital(country) {
  return countryData.find((e) => {
    return country === e.name.toUpperCase();
  }).capital;
}
