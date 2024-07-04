// Start another Express app
const express = require("express");
const indexRouter = express.Router();

//import Route Controllers
const controller = require("../controllers/controller");

indexRouter.get("/", controller.countryInfo_get);

indexRouter.get("/:country/Flights", controller.travelInfo_getFlights);

indexRouter.get("/:country/Hotels&Rooms", controller.travelInfo_getHotels);

indexRouter.get("/:country/Events", controller.travelInfo_getEvents);

indexRouter.get("/:country/Weather", controller.travelInfo_getWeather);

indexRouter.get("/:country/Attractions", controller.travelInfo_getAttractions);


//export Express app
module.exports = indexRouter;
