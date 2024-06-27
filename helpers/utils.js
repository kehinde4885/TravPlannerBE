//JSON
const countryData = require("../MynewFile4.json");
const flights = require("../mockFlights.json");

function getCountryAbout() {
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
  const isArray = Array.isArray(this.majorCities);

  if (!isArray) {
    return null;
  }

  let filtered = this.majorCities.filter((city) => {
    //console.log("Filter function",this)
    return city !== this.capital;
  });

  return filtered.length
    ? `along with major cities like ${filtered.join(",     ")}`
    : null;
}




















// Search for One Wayt Flights
async function getFlights(originID,destinationID,departDate) {
  // const url ="https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=DXB&toEntityId=NG";
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "x-rapidapi-key": "c36cdd5a8bmshfd6196790e8e7b9p13a4cbjsn0a9073a4e027",
  //     "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
  //   },
  // };

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
  //console.log(result);
  return result

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

  console.log(`getOrignWithIP,${origin}`);
  return origin;
}

//  Get Entity ID
// This helps me get the ID of the  City i want to search in Flights
async function getEntityID(location) {
  //const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${location}&placeTypes=COUNTRY`;
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

// Get Capital
function getCountry(country) {
  return countryData.find((e) => {
    return country.toUpperCase() === e.name.toUpperCase();
  });
}

function getHours(minutes) {
  let hours = Math.floor(minutes / 60);
  let min = minutes % 60;
  return `${hours}H ${min}Min`;
}

function getTime(strings) {
  let index = strings.indexOf("T");
  return strings.slice(index + 1, index + 6);
}

module.exports = {
  getCities,
  getCountryAbout,
  getFlights,
  getOriginWithIP,
  getEntityID,
  getCountry,
  getHours,
  getTime,
};
