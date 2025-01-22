// const jwt =require("jsonwebtoken");
// const usermodel =require("../models/usermodel");


// module.exports = async function (req,res,next) {
//     if(!req.cookies.token){
//         return res.redirect("/");
//     }
//     try{
//         let decode= jwt.verify(req.cookie.token,process.env.JWT_KEY);
//         let user =await usermodel.findOne({email:decode.email});
//         req.user=user;

//         next();
//         }
//     catch(err)
//     {
//     console.log(err)
//      res.redirect("/")
//     }
// };

const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");

module.exports = async function (req, res, next) {
    
    if (!req.cookies.token) {
        return res.redirect("/");
    }
    
    try {
      
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY); 
        let user = await usermodel.findOne({ email: decoded.email });

        if (!user) {
           
            return res.redirect("/");
        }

      
        req.user = user;

        
        next();
    } catch (err) {
        console.log("JWT verification error:", err);
        return res.redirect("/");
    }
};
