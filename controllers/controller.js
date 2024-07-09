let fs = require("fs");
const { DateTime } = require("luxon");

//Environment Variables
require("dotenv").config();

//Helpers
const {
  getCities,
  getCountryAbout,
  getTime,
  getCountry,
  getEntityID,
  getFlights,
  convMintoHours,
  getOriginWithIP,
  detailedHotelsSearch,
  convertPriceRange,
  hotelSearch,
  getGeolocation,
  getCurrentWeather,
  getWeatherForecast,
  popDailyForecast,
  pop3hoursForecast,
  popTodayWeather,
} = require("../helpers/utils");

exports.countryInfo_get = (req, res) => {
  let country = getCountry(req.query.country);

  country.getInfo = getCountryAbout;
  country.getCities = getCities;

  const countryAbout = country.getInfo();

  res.render("index", {
    country: country.name.toUpperCase(),
    info: countryAbout,
    categories: ["Flights", "Hotels&Rooms", "Weather", "Events", "Attractions"],
  });
};

exports.travelInfo_getFlights = async (req, res) => {
  //console.log(req.params.country);

  //res.send("Flights");

  const ip = req.ip;
  req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  //console.log(`IP`, ip);

  try {
    const { city, country } = await getOriginWithIP(ip);
    const origin = {
      city,
      country,
    };
    console.log(`origin`, origin);
    const destination = {
      city: getCountry(req.params.country).capital,
      country: req.params.country,
    };

    console.log(`destination`, destination);

    const originID = await getEntityID(origin);
    //"eyJzIjoiTEFYQSIsImUiOiIyNzUzNjIxMSIsImgiOiIyNzUzNjIxMSJ9="

    console.log("OriginID", originID);
    const destinationID = await getEntityID(destination);
    //"eyJzIjoiTE9ORCIsImUiOiIyNzU0NDAwOCIsImgiOiIyNzU0NDAwOCJ9"
    console.log("destinationID", destinationID);

    const dt = DateTime.local();
    const date = dt.toISODate();

    console.log(date);
    console.log(`Searching flights for ${origin.city} to ${destination.city}`);

    const flights = await getFlights(originID, destinationID, date);

    //console.log("Flights", flights);

    const data = flights.data.itineraries.map((e) => {
      return {
        price: e.price.formatted,
        origin: `${e.legs[0].origin.city}, ${e.legs[0].origin.country}`,
        destination: `${e.legs[0].destination.city}, ${e.legs[0].destination.country}`,
        carrier: e.legs[0].carriers.marketing[0].name,
        duration: convMintoHours(e.legs[0].durationInMinutes),
        stops: e.legs[0].stopCount,
        departure: getTime(e.legs[0].departure),
        arrival: getTime(e.legs[0].arrival),
      };
    });

    //console.log("Data", data);

    res.render("flights", { flights: data });
  } catch (error) {
    console.log("an Error HAHA", error);
  }
};

exports.travelInfo_getHotels = async (req, res) => {
  // Create Data array to be Displayed
  //const display = [];

  try {
    //get capital
    const location = req.params.country;
    const capital = getCountry(location).capital;

    console.log("getting Hotels");
    //Call to location Search API
    const hotels = await hotelSearch(capital);

    console.log("getting Detailed Description");
    const detailedHotels = await detailedHotelsSearch(hotels);
    console.log("giving detialed hotels");

    //console.log(detailedHotels);

    // Thin down detailed locations Array
    const hotelsToDisplay = detailedHotels.map((hotel, index) => {
      const value = hotel.value;
      //console.log("From hotelsTD",index, value)
      console.log("Processing INdex:", index);

      const {
        name,
        description,
        web_url,
        address_obj,
        ranking_data,
        rating_image_url,
        num_reviews,
        price_level,
        amenities,
        awards,
        images,
      } = value;

      return {
        name,
        description: description.slice(0, 70).trim().concat("..."),
        web_url,
        // address: address_obj["address_string"],
        // ranking_data: ranking_data.ranking_string,
        rating_image_url,
        // num_reviews,
        price_level: convertPriceRange(price_level),
        amenities: amenities.slice(0, 6),
        // awards,
        image: images.data[0].images.large.url,
      };
    });

    res.render("hotels", { hotels: hotelsToDisplay });
  } catch (error) {
    console.log("Async Error", error);
  }
};

// ***********************

exports.travelInfo_getWeather = async (req, res) => {
  try {
    const { capital: destCapital } = getCountry(req.params.country);

    const { lat, lon } = await getGeolocation(destCapital);

    const currentWeather = await getCurrentWeather(lat, lon);

    const { list } = await getWeatherForecast(lat, lon);

    const current = popTodayWeather(currentWeather);

    const dailyForecast = popDailyForecast(list);

    const threeHrFocast = pop3hoursForecast(list);

    res.render("weather", {
      today: current,
      forecast: dailyForecast,
      hourly: threeHrFocast,
    });
  } catch (error) {
    console.log("travInfo_GetWeather:", error);
  }
};

//************************ */
// TESTINg
// exports.travelInfo_getWeather = async (req, res) => {
//   //console.log(req.params);

//   try {
//     //const { capital: destCapital } = getCountry(req.params.country);

//     //const { lat, lon } = await geolocation(destCapital);

//     // console.log(destCapital);

//     const currentWeather = await getCurrentWeather(3, 6);

//     //const { list } = await getWeatherForecast(lat, lon);

//     //DEstructuring

//     const {
//       weather: [{ icon }],
//       main: { temp, feels_like: realFeel, pressure, humidity },
//       wind,
//       dt: date,
//       sys: { sunrise },
//     } = currentWeather;

//     console.log(DateTime.fromSeconds(date).toISO());

//     //res.render("weather", [{icon,temp,realFeel, pressure, humidity,wind},{}]);
//   } catch (error) {}
// };

// module.exports.travelInfo_getWeather();

exports.travelInfo_getEvents = async (req, res) => {
  //Implement Fallback api with Rapid

  const country = req.params.country;
  //get country object
  const countryIso = getCountry(country).iso2;

  //get events file through commonJS import, relative to this file
  const events = require(`../newDatafiles/${countryIso}.json`);

  //Filter the Events by date for Relevancy
  //Filter function

  //Destructure
  const toRender = events.map((event) => {
    let {
      title,
      description,
      category,
      start,
      geo: {
        address: { formatted_address: address },
      },
      labels,
      duration,
    } = event;

    start = DateTime.fromISO(start).toLocaleString({
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    duration = convMintoHours(Math.floor(duration/60))
   
    return {
      title,
      description,
      category,
      start,
      duration,
      address,
      labels,
    };
  });

  // render the Events view template
  // with 10 Events
  res.render("events", { events: toRender.slice(0, 10), country: country });

  // get the File of the country
  // Array of Events
  // Each event is an Object
};

exports.travelInfo_getAttractions = async (req, res) => {
  res.send("Attractions");
};
