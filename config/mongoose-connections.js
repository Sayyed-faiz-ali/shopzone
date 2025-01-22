const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("development:mongoose");

mongoose.connect(`${config.get('mongodb_URI')}/usermodel`)
    .then(function() {
        debug("connected");
    })
    .catch(function(err) {
        console.error("Connection error:", err);
    });
