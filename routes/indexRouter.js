// Start another Express app
const express = require("express");
const indexRouter = express.Router();

//import Route Controllers
const controller = require("../controllers/controller");


indexRouter.get("/", controller.countryInfo_get);

indexRouter.get("/:country/:Info", controller.travelInfo_get);

//export Express app
module.exports = indexRouter;

