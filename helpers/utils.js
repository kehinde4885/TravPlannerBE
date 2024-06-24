function getCountryInfo() {
  const gottenCities = this.getCities();

  return `Welcome to ${this.name}, a land of profound history and rugged beauty
    located in ${this.subregion}. This country is ${this.landlocked ? "landlocked" : "not landlocked"}, officially
    known as the ${this.official}, is a captivating blend
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


module.exports = {getCities, getCountryInfo}