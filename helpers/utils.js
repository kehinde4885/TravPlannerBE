//JSON
const countryData = require("../MyCountries.json");
const Bottleneck = require("bottleneck");
const { DateTime } = require("luxon");
require("dotenv").config();

function getCountryAbout() {
  //Used inside a Class/Object
  //Used as a Method
  const gottenCities = this.getCities();

  return `Welcome to ${this.name}, a land of profound history and rugged beauty
    located in ${this.subregion}. This country is ${this.landlocked ? "landlocked" : "not landlocked"}, officially
    known as ${this.official}, is a captivating blend
    of ancient traditions and modern resilience. Its capital,${this.capital} 
    ${gottenCities ? gottenCities : ""},
      offers a glimpse into the heart of ${this.nationality} culture and life. ${this.name} spans
    an area of ${this.area} square kilometers and is home to a population of
    over  ${this.population} people. 
    The currency here is the ${this.currencies[this.currency].name} (${this.currency}), 
    symbolized by ${this.currencies[this.currency].symbol}. 
    The country is renowned for its stunning
    landscapes, from towering mountains to sprawling deserts, and its rich
    cultural heritage, including historic sites and traditional crafts.
    For those seeking adventure and a deep cultural experience,
    ${this.name} presents a unique opportunity. Despite its challenges, the
    nation's spirit and hospitality leave a lasting impression on those
    who visit. Discover the resilient and hospitable ${this.nationality} people,
    explore ancient cities, and take in the breathtaking scenery. With its
    rich history and vibrant culture, ${this.name} is a destination that
    offers a profound journey for the intrepid traveler. Explore more
    about ${this.name} and its diverse offerings on the map here.`;
}

function getCities() {
  //Used inside a Class/Object
  //Used as a Method
  const isArray = Array.isArray(this.majorCities);

  if (!isArray) {
    return null;
  }

  let filtered = this.majorCities.filter((city) => {
    //console.log("Filter function",this)
    return city !== this.capital;
  });

  return filtered.length
    ? `along with major cities like ${filtered.join(", ")}`
    : null;
}

// Search for One Wayt Flights
async function getFlights(originID, destinationID, departDate) {
  const url = `https://skyscanner80.p.rapidapi.com/api/v1/flights/search-one-way?fromId=${originID}&toId=${destinationID}&departDate=${departDate}&adults=1&cabinClass=economy&currency=USD&market=US&locale=en-US`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.SKY_SCANNER}`,
      "x-rapidapi-host": "skyscanner80.p.rapidapi.com",
    },
  };

  const response = await fetch(url, options);
  const result = await response.json();
  // console.log(result);
  return result;
}

async function getOriginWithIP(ip) {
  // get Location name from Abstract API
  // Use Environment Variables for API Keys
  const apiKey = process.env.ABSTRACT_GEOKEY;
  const baseUrl = "https://ipgeolocation.abstractapi.com/v1";

  //For PRoduction only
  // Convert Ip to String

  const url =
    process.env.NODE_ENV === "Production"
      ? `${baseUrl}?api_key=${apiKey}&ip_address=${ip.toString()}`
      : // for Development
        `${baseUrl}?api_key=${apiKey}&ip_address=${"102.89.23.78"}`;

  let response = await fetch(url);
  let location = await response.json();

  return location;

  //const origin = { city: location.city, country: location.country };

  //console.log(`getOrignWithIP,${origin}`);
  //return origin;
}

//  Get Entity ID
// This helps me get the ID of the  City i want to search in Flights
async function getEntityID(location) {
  //const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${location}&placeTypes=COUNTRY`;
  //const url = `https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete?query=${location.city}`;
  const url = `https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete?query=${location.city}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.SKY_SCANNER}`,
      //"x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
      "x-rapidapi-host": "skyscanner80.p.rapidapi.com",
    },
  };

  let dataPromise = await fetch(url, options);
  let data = await dataPromise.json();

  //return data.data[0].id

  // console.log(location)

  let actualCity = data.data.find((e) => {
    return (
      e.presentation.subtitle.toUpperCase() === location.country.toUpperCase()
    );
  });

  // console.log(actualCity)
  return actualCity.id;

  //console.log(data.data[0].presentation.skyId);

  //return data.data[0].presentation.skyId;
}

// Get Country from Local JSON
function getCountry(country) {
  return countryData.find((e) => {
    return country.toUpperCase() === e.name.toUpperCase();
  });
}

function convMintoHours(minutes) {
  let hours = Math.floor(minutes / 60);
  let min = minutes % 60;

  return `${hours}H ${min}Min`;
}

function getTime(strings) {
  let index = strings.indexOf("T");
  return strings.slice(index + 1, index + 6);
}

async function detailTripAdvSearch(places) {
  const limiter = new Bottleneck({ minTime: 8000, maxConcurrent: 1 });
  //*OR* this is returned to external await
  // return limiter
  //   .schedule(() => {
  //     // creates an array of Promises

  //     const promiseToGetHotels = hotels.map((hotel, index) => {
  //       //Create a new Promise for each hotel in the hotels array
  //       // The promise Resolves to an object with more
  //       // detailed informatiion about each hotel
  //       const id = hotel.location_id;
  //       const promise = new Promise((resolve, reject) => {
  //         const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/details?language=en&currency=USD&key=${process.env.TRIPADVISOR}`;
  //         const options = {
  //           method: "GET",
  //           headers: { accept: "application/json" },
  //         };

  //         fetch(url, options)
  //           .then((res) => res.json())
  //           .then((json) => {
  //             console.log("got hotel", index);
  //             //console.log(json)
  //             resolve(json);
  //           })
  //           .catch((err) => {
  //             console.error("Get Detailed Hotel error:" + err);
  //             reject(err);
  //           });
  //       });

  //       return promise;
  //     });

  //     return Promise.allSettled(promiseToGetHotels);
  //   })
  //   .then((results) => {
  //     const promiseToGetPictures = results.map((result) => {
  //       const hotel = result.value;
  //       const id = hotel.location_id;
  //       //create an array of promises
  //       const promise = new Promise((resolve, reject) => {
  //         const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/photos?language=en&limit=1&key=${process.env.TRIPADVISOR}`;
  //         const options = {
  //           method: "GET",
  //           headers: { accept: "application/json" },
  //         };

  //         fetch(url, options)
  //           .then((res) => res.json())
  //           .then((images) => {
  //             //Combine both Fetch Requests Here
  //             console.log("combining Images");
  //             //console.log(images)
  //             //console.log({ ...json, images });
  //             //return ;
  //             resolve({ ...hotel, images });
  //           })
  //           .catch((err) => console.error("Get Images error:" + err));
  //       });

  //       return promise;
  //     });

  //     //this return another Promuse to the iswear Promuse Statement
  //     return Promise.allSettled(promiseToGetPictures);
  //   })
  //   .then((final) => {
  //     return final;
  //   });
  //Limiter Function ends Here
  //++++++++++++++++++++++++++++++++++++++//

  //++++++++++++++++++++++++++++++++++++/
  //Alternative implemented with setTimeout and Promises
  //creates an array of Promises
  const promiseToGetPlaces = places.map((place, index) => {
    //Create a new Promise for each hotel in the hotels array
    // The promise Resolves to an object with more
    // detailed informatiion about each hotel
    const id = place.location_id;
    const promise = new Promise((resolve, reject) => {
      const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/details?language=en&currency=USD&key=${process.env.TRIPADVISOR}`;
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          console.log("got place", index);
          //console.log(json)
          resolve(json);
        })
        .catch((err) => {
          console.error("Get Detailed place error:" + err);
          reject(err);
        });
    });

    return promise;
  });

  // Promise.allSettled check each promise in the
  // Earlier created array and returns a promise for them
  // The delay function here implements a wait time before asking
  // if the hotels have been gotten
  const delay = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Promise.allSettled(promiseToGetPlaces).then((results) =>
          resolve(results)
        );
      }, ms);
    });
  };

  //Waits for the results of the delay function
  const iSwear = await delay(5000);

  const promiseToGetPictures = iSwear.map((result) => {
    const place = result.value;
    const id = place.location_id;
    //create an array of promises
    const promise = new Promise((resolve, reject) => {
      const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/photos?language=en&limit=1&key=${process.env.TRIPADVISOR}`;
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((images) => {
          //Combine both Fetch Requests Here
          console.log("combining Images");
          //console.log(images)
          //console.log({ ...json, images });
          //return ;
          resolve({ ...place, images });
        })
        .catch((err) => console.error("Get Images error:" + err));
    });

    return promise;
  });

  //*OR* this is returned to external await
  return Promise.allSettled(promiseToGetPictures);
}

function tripAdvisorSearch(category, coord, country) {
  //Figure out what reject does
  const promise = new Promise((resolve, reject) => {
    const url = `https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${country}&category=${category}&latLong=%22${coord.lat}%2C-${coord.lon}%22&language=en&key=${process.env.TRIPADVISOR}`;
    const options = { method: "GET", headers: { accept: "application/json" } };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        //console.log(json.data);
        resolve(json.data);
      })
      .catch((err) => {
        console.error("error:" + err);
        reject();
      });
  });

  return promise;
}

function convertPriceRange(str) {
  const map = {
    1: "Cheapest",
    2: "Affordable",
    3: "Moderate",
    4: "Pricey",
    5: "Expensive",
  };

  const strLen = str.length;

  return map[String(strLen)];
}

const detailHotelFetch = async (id) => {
  const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/details?language=en&currency=USD&key=${process.env.TRIPADVISOR}`;
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };
  const result = await fetch(url, options);
  const data = await result.json();
  return data;
};

const detailImageFetch = async (id) => {
  const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/photos?limit=1&key=${process.env.TRIPADVISOR}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  const result = await fetch(url, options);
  const data = await result.json();
  return data;
};

async function getGeolocation(city) {
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

function popDailyForecast(list) {
  const dailyForecast = [];
  for (let startIndex = 7; startIndex <= list.length; startIndex += 8) {
    const {
      dt,
      main: { temp },
      weather: [{ icon }],
    } = list[startIndex];

    dailyForecast.push({
      day: DateTime.fromSeconds(dt).weekdayShort,
      temp: Math.floor(temp),
      icon,
    });
  }

  return dailyForecast;
}

function pop3hoursForecast(list) {
  //Destructuting
  const threeHrFocast = list.slice(0, 4).map((element) => {
    const {
      dt_txt,
      main: { temp },
      weather: [{ icon }],
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

  return threeHrFocast;
}

function popTodayWeather(currentWeather) {
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

  return current;
}

module.exports = {
  getCities,
  getCountryAbout,
  getFlights,
  getOriginWithIP,
  getEntityID,
  getCountry,
  convMintoHours,
  getTime,
  detailTripAdvSearch,
  tripAdvisorSearch,
  convertPriceRange,
  getGeolocation,
  getCurrentWeather,
  getWeatherForecast,
  popDailyForecast,
  pop3hoursForecast,
  popTodayWeather,
};
