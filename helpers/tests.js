    //For travelInfo_getHotels function
    // const {
    //   name,
    //   description,
    //   web_url,
    //   ranking_data,
    //   rating_image_url,
    //   price_level,
    //   amenities,
    //   images,
    // } = detailedHotels;

    // const dataTodisplay = {
    //   name,
    //   image: images.data[0].images.large.url,
    //   ranking_data,
    //   rating_image_url,
    //   web_url,
    //   priceLevel: convertPriceRange(price_level),
    //   description,
    //   amenities: amenities.slice(0, 6),
// };
    
//********************8 */
//For Detailed Hotel Search function
//GETS ONLY ONE HOTEL FOR TESTING.
  // const id = "193108";
  // const promise1 = new Promise((resolve, reject) => {
  //   const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/details?language=en&currency=USD&key=${process.env.TRIPADVISOR}`;
  //   const options = {
  //     method: "GET",
  //     headers: { accept: "application/json" },
  //   };

  //   fetch(url, options)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log("got hotel");
  //       resolve(json);
  //     })
  //     .catch((err) => {
  //       console.error("Get Detailed Hotel error:" + err);
  //       reject(err);
  //     });
  // });

  // //Promise.allSettled check each promise in the
  // //Earlier created array and returns a promise for them
  // const promise2 = promise1.then((results) => {
  //   //console.log(results)
  //   const url = `https://api.content.tripadvisor.com/api/v1/location/${id}/photos?language=en&limit=1&key=${process.env.TRIPADVISOR}`;
  //   const options = {
  //     method: "GET",
  //     headers: { accept: "application/json" },
  //   };

  //   return fetch(url, options)
  //     .then((res) => res.json())
  //     .then((images) => {
  //       //Combine both Fetch Requests Here
  //       console.log("combining Images");
  //       return { ...results, images };
  //     })
  //     .catch((err) => console.error("Get Images error:" + err));
  // });

  // console.log(promise2);

  // const iSwear2 = promise2.then((final) => {
  //   return final;
  // });

  //console.log(iSwear2)
  // return iSwear2;