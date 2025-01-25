require('dotenv').config(); 
const config = require("config");
const debug = require("debug")("development:mongoose");
const mongoose = require("mongoose");

const mongoURI = config.has('mongodb_URI') 
    ? config.get('mongodb_URI') 
    : process.env.mongodb_URI;

if (!mongoURI) {
    console.error("Error: MongoDB URI is not defined in config or environment variables.");
    process.exit(1); 
}

mongoose.connect(`${mongoURI}/usermodel`)
    .then(() => {
        debug("Connected to MongoDB.");
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });
