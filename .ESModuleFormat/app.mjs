// ESModules Alternative for App.js
// Remember to set "type" : Module in Package.json

// CommonJS Module Loading
// const express = require("express");

import e from "express";

//const path = require("path");
import * as path from 'node:path'


import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)

//const logger = require("morgan");
import morgan from "morgan";

const app = e();


// Route
//const indexRouter = require("./routes/indexRouter.mjs");
import indexRouter from "./routes/indexRouter.mjs";

// Logger MiddleWare
// Logs out Request Details to Console
app.use(morgan("dev"));

//Statci files using absolute Path
// Application Level Middleware
app.use(e.static(path.join(__dirname, 'public')));

//Runs everytime a request is Recieved
// app.use("/", (req, res) => {
//   res.send("Welcome to Travel Planner");
// });

//Set directory of Template Files
app.set("views", "./views");

//Set Template Engine to Pug
app.set("view engine", "pug");

// Serve Static Homepage on the Get
// Request to "/"
// request that begins with /
//app.use("/", express.static(path.join(__dirname, "public")));

app.use("/home", indexRouter);

// //runs when a get request to "/"
// app.get("/home", (req, res) => {
//   res.send("Welcome to Travel Planner");
// });

//module.exports = app;


export default app;

// Since i Export this File (mainly App)
// as a Module
// when it is imported ,the statements
// on this Page are evaluated and Executed.
