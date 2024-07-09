let fs = require("fs");
//Environment Variables
require("dotenv").config();

//Sorts Helsinki
function function1() {
  //Sort Helsinki
  //temporary Arr
  let arr = [];
  let arr3 = [];

  let helsinki = require("../json/HelsinkiSorted.json");

  //Push out only required data for Sorting
  helsinki.map((e, index) => {
    arr.push({ index: index, value: e.name.common });
  });

  //Sort Alphabetically
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

  //Using the Sorted Array,
  //Push the complete data from helsinki into a new array
  //Which would also now be sorted
  arr.map((e) => {
    arr3.push(helsinki[e.index]);
  });

  //Store in File
  fs.writeFile("HelsinkiSorted.json", JSON.stringify(arr3), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

//Creates My File from sorted County,City,State
function function2() {
  //Create MyFile from Country City State
  //Function 2
  //const model2 = require("../coutStatCit2.0.json");
  const model2 = require("../coutStatCit2.0Sorted.json");

  let model3 = model2.map((element) => {
    // Gets the states array
    // Find the state that has the same name with the capital

    let capitalStateObject = element.states.find((e) =>
      //Find the State object of the Capital state
      e.name.includes(element.capital)
    );

    //ARRAY
    // check if the capitalStateObject is not Empty
    let capitalCities = capitalStateObject ? capitalStateObject.cities : null;

    //If it's not Empty DO:
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

    //If it's Empty DO:
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

//function3()
//Sorts Country,City,State
function function3() {
  //Sorts CountryCityState
  //temporary Arr
  let arr4 = [];
  let arr5 = [];

  let countries = require("../json/coutStatCit2.0Sorted.json");

  countries.map((e, index) => {
    //Step1
    //Stores the item and its current location in arr4
    arr4.push({ index: index, value: e.name });
  });

  //Step 2
  //Sorts the array4 by the value key
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
    // Goes to the original unsorted array
    // Gets the same item using the location
    // Stored during step 1
    // Stores the item in arr5
    arr5.push(countries[e.index]);
  });

  fs.writeFile(
    "coutStatCit2.0Sorted.json",
    JSON.stringify(arr5),
    function (err) {
      if (err) throw err;
      console.log("saved");
    }
  );
}

//Sorts MyFile/MyCountries
function function4() {
  //Sorts Mycountries
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

  fs.writeFile("MynewFile3Sorted.json", JSON.stringify(arr3), function (err) {
    if (err) throw err;
    console.log("saved");
  });
}

// const helsinki = require("../json/HelsinkiSorted.json");

// const myfile = require("../json/MynewFile3.json");

// const cout = require("../json/coutStatCit2.0Sorted.json");

// cout.map((e, index) => {
//   e.name === myCountries[index].name
//     ? console.log("same", index)
//     : console.log({ t: e.name, m: myCountries[index].name });
// });

// let mapped = myCountries.map((element, index) => {
//   return { ...element, iso3: cout[index].iso3, iso2: cout[index].iso2 };
// });

// fs.writeFile("MyCountries2.json", JSON.stringify(mapped), function (err) {
//   if (err) throw err;
//   console.log("saved");
// });

function function5() {
  //Cross checks my file with helsinkiDB
  // then combines it if checks pass

  let mapped = myfile.map((e, index) => {
    //
    //return {m:e.name,h:helsinki[index].name.common}
    // return e.name === helsinki[index].name.common ? true : `${e.name}false`
    e.name === helsinki[index].name.common
      ? ""
      : console.log({ m: e.name, h: helsinki[index].name.common });
    let obj = helsinki[index];
    //Combines Helsinki DB with MyNewFile--
    // Stores it in Mapped
    // Write Storage is not Present
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
}

//PREDict HQ LOGIc

async function mainEdit() {
  const nonExisting = [];
  const myCountries = require("../MyCountries.json");
  for (let index = 0; index < myCountries.length; index++) {
    const element = myCountries[index];

    // fs.promises
    //   .access(`./DataFiles/${element.iso2}.json`)
    //   .then(() => {
    //     console.log("existing");
    //   })
    //   .catch(() => {
    //     nonExisting.push(element.iso2);
    //   });

    // try {
    //   fs.accessSync(`./DataFiles/${element.iso2}.json`);
    // } catch (err) {
    //   nonExisting.push(element.iso2);
    // }

    //Trim Event JSON Data, size is too Large
    try {
      //get the country of the current loop iteration.
      const countryEvents = require(`../Datafiles/${element.iso2}.json`);

      console.log(`checking ${element.name}`);

      const newData = countryEvents.map((event) => {
        const {
          title,
          description,
          category,
          start,
          geo,
          labels,
          duration,
          start_local,
          end,
          end_local,
          updated,
        } = event;

        return (data = {
          title,
          description,
          category,
          start,
          geo,
          labels,
          duration,
          start_local,
          end,
          end_local,
          updated,
        });
      });

      //Store it in new File
      fs.writeFile(
        `newDataFiles/${element.iso2}.json`,
        JSON.stringify(newData),
        function (err) {
          if (err) throw err;
          console.log("saved");
        }
      );
    } catch (error) {
      console.log(`${element.name} is the issue`, error);
    }
  }
}

//mainEdit();

//Origimal Function
async function main(iso2) {
  function delay() {
    console.log("delaying for 30 Secs");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    });
  }

  // await delay();

  console.log(`Starting ${iso2}`);
  let arr = [];
  async function collateData(url) {
    console.log(url);
    function delay() {
      console.log("delaying for 1 Secs");
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }

    await delay();

    try {
      const options = {
        headers: {
          Authorization: `${process.env.PREDICTHQ}`,
          Accept: "application/json",
        },
      };

      const rawData = await fetch(url, options);

      const data = await rawData.json();

      //console.log(data);

      if (data.next === null) {
        // arr.push(results.results);
        arr = arr.concat(data.results);
        console.log(`done with ${iso2}`);

        fs.writeFile(
          `DataFiles/${iso2}.json`,
          JSON.stringify(arr),
          function (err) {
            if (err) throw err;
            console.log("saved");
          }
        );

        return;
      }

      //arr.push(results.results);

      arr = arr.concat(data.results);

      //console.log("next request is:", data.next);

      collateData(data.next);
    } catch (error) {
      console.log(`PredictHQAPIERROR${iso2}`, error);
    }
  }

  await collateData(
    `https://api.predicthq.com/v1/events?country=${iso2}&category=politics%2Cconferences%2Cexpos%2Cconcerts%2Cfestivals%2Cperforming-arts%2Csports%2Ccommunity%2Cacademic`
  );
}
