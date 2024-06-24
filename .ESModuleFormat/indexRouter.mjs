// Start another Express app
//const express = require('express')

// ESModules
import fetch from "node-fetch";
import e from "express";

//console.log(e);


const indexRouter = e.Router();

indexRouter.get("/", (req, res) => {
  console.log(req.query.country);

  let data = fetch("https://api.github.com/users/github");
  console.log(data);

  console.log("Response Recieved");
  res.render("index", { title: "Hey", message: "Hello There!" });
});

//export Express app

export default indexRouter;
