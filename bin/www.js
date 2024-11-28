//Load Environment Variables
require('dotenv').config()

// Import Express App
const app = require("../app");

// Import  Node HTTP Object
const http = require("http");

//set Debugger
const debug = require("debug")("travplannerbe:server");

// Get Port from Environment Variables
// or set it as 3000
const port = normalizePort(process.env.port || "3000");

// Stores the value of port above in Express
// as a variable named 'port'
app.set("port", port);

// create http Server and pass the function app
const server = http.createServer(app);

// Starts the Server and
// tell server to Listen to Port
server.listen(port);

//using the parent Class net.server
// Set Event Hadlers

server.on("error", onError);
server.on("listening", onListen);

// Define normalizePort Function

function normalizePort(val) {
  var port = parseInt(val, 10);

  //??? ???
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListen() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  //Message for the Debugger Middleware(morgan)
  debug("Listening on " + bind);
  console.log("Ready");
}
