let fs = require("fs");

function function1() {
  //Sort Helsinki
  //temporary Arr
  let arr = [];
  let arr3 = [];

  let helsinki = require("../json/HelsinkiSorted.json");

  helsinki.map((e, index) => {
    arr.push({ index: index, value: e.name.common });
  });

  // // //console.log(arr.length);
  arr.sort((a, b) => {
    const nameA = a.value.toUpperCase();
    const nameB = b.value.toUpperCase();

    if (nameA > nameB) {
      return 1;
    }

    if (nameA < nameB) {
      return -1;
    }

    return 0;
  });

  arr.map((e) => {
    arr3.push(helsinki[e.index]);
  });

  fs.writeFile("HelsinkiSorted.json", JSON.stringify(arr3), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

function1();

function function2() {
  //Create MyFile from Country City State
  //Function 2
  const model2 = require("../coutStatCit2.0.json");

  let model3 = model2.map((element) => {
    // Gets the states array
    // Find the state that has the same name with the capital

    let capitalStateObject = element.states.find((e) =>
      e.name.includes(element.capital)
    );

    //ARRAY
    let capitalCities = capitalStateObject ? capitalStateObject.cities : null;

    if (capitalCities) {
      // console.log(capitalCities)
      let arr = capitalCities.map((e) => e.name);

      return {
        name: element.name,
        capital: element.capital,
        currency: element.currency,
        region: element.region,
        subregion: element.subregion,
        nationality: element.nationality,
        majorCities: arr.length ? arr.slice(0, 5) : "No Cities Found",
      };
    }

    return {
      name: element.name,
      capital: element.capital,
      currency: element.currency,
      region: element.region,
      subregion: element.subregion,
      nationality: element.nationality,
      majorCities: "No Cities Found",
    };
  });

  fs.writeFile("MynewFile3.json", JSON.stringify(model3), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

function function3() {
  //Sorts CountryCityState
  //temporary Arr
  let arr4 = [];
  let arr5 = [];

  let countries = require("../helpers/countries+states+cities.json");

  countries.map((e, index) => {
    arr4.push({ index: index, value: e.name });
  });

  // // //console.log(arr.length);
  arr4.sort((a, b) => {
    const nameA = a.value.toUpperCase();
    const nameB = b.value.toUpperCase();

    if (nameA > nameB) {
      return 1;
    }

    if (nameA < nameB) {
      return -1;
    }

    return 0;
  });

  arr4.map((e) => {
    arr5.push(countries[e.index]);
  });

  fs.writeFile("c+s+c2.0.json", JSON.stringify(arr5), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

function function4() {
  //Sorts Myfile
  //temporary Arr
  let arr = [];
  let arr3 = [];

  let myFile = require("../json/MynewFile3.json");

  myFile.map((e, index) => {
    arr.push({ index: index, value: e.name });
  });

  // // //console.log(arr.length);
  arr.sort((a, b) => {
    const nameA = a.value.toUpperCase();
    const nameB = b.value.toUpperCase();

    if (nameA > nameB) {
      return 1;
    }

    if (nameA < nameB) {
      return -1;
    }

    return 0;
  });

  arr.map((e) => {
    arr3.push(myFile[e.index]);
  });

  fs.writeFile("MynewFile3.json", JSON.stringify(arr3), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

function4();

const helsinki = require("../json/HelsinkiSorted.json");

const myfile = require("../json/MynewFile3.json");

let mapped = myfile.map((e, index) => {
  //return {m:e.name,h:helsinki[index].name.common}
  // return e.name === helsinki[index].name.common ? true : `${e.name}false`

  //e.name ===helsinki[index].name.common ? "": console.log({m:e.name,h:helsinki[index].name.common})

  let obj = helsinki[index];

  if (e.name === obj.name.common) {
    return {
      ...e,
      official: obj.name.official,
      currencies: obj.currencies,
      latlng: obj.latLng,
      area: obj.area,
      landlocked: obj.landlocked,
      map: obj.maps.googleMaps,
      population: obj.population,
      flags: obj.flags,
      coatOfArms: obj.coatOfArms,
    };
  }

  console.log("Failed");
});
