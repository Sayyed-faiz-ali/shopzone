const jwt = require ("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {

    try {
        
        return jwt.sign({ email: user.email, userid: user._id },process.env.JWT_KEY);
    } catch (error) {
        console.error("Token generation error:", error);
        throw error; 
    }
};





module.exports.generateToken = generateToken;
