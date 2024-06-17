// Start another Express app
const express = require('express')

const index = express.Router()


index.get('/', (req, res) => {
    console.log("Response Recieved")
    res.render('index',{title: 'Hey' , message: 'Hello There!'})
})


//export Express app

module.exports = index