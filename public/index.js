console.log("I am ready");

const navigator = window.navigator;

const geolocation = navigator.geolocation;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const success = (pos) => {
  console.log(pos.coords);
};

const err = (err) => {
  console.log(err);
};

geolocation.getCurrentPosition(success, err, options);


async function getEntityID() {
  const url = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=UnitedArabEmirates&placeTypes=COUNTRY`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c36cdd5a8bmshfd6196790e8e7b9p13a4cbjsn0a9073a4e027",
      "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
    },
  };

  let dataPromise = await fetch(url,options)
  let data = await dataPromise.json()

  console.log(data.data[0].presentation.id)
 
  // return data.presentation.id
}

//Search round Trip Flights
