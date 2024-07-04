let fs = require("fs");
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
  detailedHotelsSearch,
  convertPriceRange,
  hotelSearch,
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
        duration: getHours(e.legs[0].durationInMinutes),
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

    const { lat, lon } = await geolocation(destCapital);

    const currentWeather = await getCurrentWeather(lat, lon);

    const { list } = await getWeatherForecast(lat, lon);

    //Destructuting
    const threeHrFocast = list.slice(0, 4).map((element) => {
      const {
        dt_txt,
        main: { temp },
        weather: [icon],
      } = element;
      
      const isoDate = dt_txt.replace(" ", "T");
      const time = DateTime.fromISO(isoDate).toLocaleString({
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h12",
      });

      return {
        time,
        temp: Math.floor(temp),
        icon,
      };
    });
    
    const dailyForecast = [];
    for (let startIndex = 7; startIndex <= list.length; startIndex += 8) {
      const {
        dt,
        main: { temp },
        weather: [icon],
      } = list[startIndex];

      dailyForecast.push({
        day: DateTime.fromSeconds(dt).weekdayShort,
        temp: Math.floor(temp),
        icon,
      });
    }

    //DEstructuring
    const {
      weather: [{ icon: currentIcon }],
      main: { temp: currentTemp, feels_like: realFeel, pressure, humidity },
      wind,
      dt: date,
    } = currentWeather;

    const current = {
      currentIcon,
      temp: Math.floor(currentTemp),
      realFeel: Math.floor(realFeel),
      pressure,
      humidity,
      wind: { ...wind, speed: Math.floor(wind.speed) },
    };

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

async function geolocation(city) {
  try {
    const results = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER}`
    );

    const data = await results.json();
    return data[0];
  } catch (error) {
    console.log("geolocation", error);
  }
}

async function getCurrentWeather(lat, lon) {
  try {
    const results = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER}&units=metric`
    );
    const data = await results.json();

    return data;
  } catch (error) {
    console.log("getCurrentWeather", error);
  }
}

async function getWeatherForecast(lat, lon) {
  try {
    const results = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER}&units=metric`
    );
    const data = await results.json();

    return data;
  } catch (err) {
    console.log("getWeatherForecast", err);
  }
}

exports.travelInfo_getEvents = async (req, res) => {
  res.send("Events");
};

exports.travelInfo_getAttractions = async (req, res) => {
  res.send("Attractions");
};
