const { DateTime } = require("luxon");
// exports.book_update_get = asyncHandler(async (req, res, next) => {

//Environment Variables
require("dotenv").config();


const flights = require("../mockFlights.json");

//Helpers
const {
  getCities,
  getCountryAbout,
  getTime,
  getCountry,
  getEntityID,
  getFlights,
  getHours,
  getOriginWithIP,
} = require("../helpers/utils");

exports.countryInfo_get = (req, res) => {
  let country = getCountry(req.query.country);

  country.getInfo = getCountryAbout;
  country.getCities = getCities;

  const countryAbout = country.getInfo();

  res.render("index", {
    country: country.name.toUpperCase(),
    info: countryAbout,
    categories: [
      "Flights",
      "Hotels & Rooms",
      "Weather",
      "Events",
      "Attractions",
    ],
  });
};





exports.travelInfo_get = async (req, res) => {
  const ip = req.ip;
  req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  try {
    const origin = await getOriginWithIP(ip);
    const destination = {
      city: getCountry(req.params.country).capital,
      country: req.params.country,
    };

    console.log(`Searching flights for ${origin.city} to ${destination.city}`);

    const originID = await getEntityID(origin);
    const destinationID = await getEntityID(destination);

    const dt = DateTime.local();
    const date = dt.toISODate();

    const flights = await getFlights(originID, destinationID, date);


    const data = flights.data.itineraries.map((e) => {
      return {
        price: e.price.formatted,
        origin: `${e.legs[0].origin.city}, ${e.legs[0].origin.country}`,
        destination: `${e.legs[0].destination.city}, ${e.legs[0].destination.country}`,
        carrier: e.legs[0].carriers.marketing[0].name,
        duration: getHours(e.legs[0].durationInMinutes),
        stops: e.legs[0].stopCount,
        departure: getTime(e.legs[0].departure),
        arrival: getTime(e.legs[0].arrival),
      };
    });
    res.render("flights", { flights: data });
  } catch (error) {
    console.log("an Error HAHA", error);
  }
};
