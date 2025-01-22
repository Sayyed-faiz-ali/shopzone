// const jwt = require("jsonwebtoken");
// const ownermodel = require("../models/ownermodel");

// module.exports = async function (req, res, next) {
    
//     if (!req.cookies.token) {
//         return res.redirect("/owner/reg");
//     }
    
//     try {
      
//         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY); 
//         let user = await ownermodel.findOne({ email: decoded.email });

//         if (!user) {
           
//             return res.redirect("/owner/reg");
//         }

      
//         req.user = user;

        
//         next();
//     } catch (err) {
//         console.log("JWT verification error:", err);
//         return res.redirect("/owner/admin");
//     }
// };