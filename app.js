
// CommonJS Module Loading
const express = require("express");
const path = require("path");
const logger = require("morgan");

const app = express();


// Route
const indexRouter = require("./routes/indexRouter.js");


// Logger MiddleWare
// Logs out Request Details to Console
app.use(logger("dev"));

//Statci files using absolute Path
// Application Level Middleware
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;




// Since i Export this File (mainly App)
// as a Module
// when it is imported ,the statements
// on this Page are evaluated and Executed.
