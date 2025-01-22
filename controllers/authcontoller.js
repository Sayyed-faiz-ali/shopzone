const bcrypt=require("bcrypt");
const path = require("path");
const usermodel = require("../models/usermodel");
const { generateToken } = require(path.join(__dirname,"../utiles/generatetoken"));
const productmodel = require("../models/productsmodel");
const { JWT_KEY } = require("../config/keys")

module.exports.registeruser = async function(req,res){
    try{
let {fullname,email,password}=req.body;
if (!fullname||!email || !password){
res.status(402).send("please enter full detailed")
// alert("please enter full detailed")
// res.redirect("/")

}
let user= await usermodel.findOne({email});
if(user) return res.status(500).send("user already registered");
bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash) => {
      let user =  await usermodel.create({
            fullname,
            email,
            password:hash
        });
      let token= generateToken(user);
      res.cookie("token",token);
      res.redirect("/login");
      
      
    })
})
}
catch (err){
    return res.status(500).send("user already registered");

}
}
// login



module.exports.loginUser = async (req, res) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password required.");
        }

        const user = await usermodel.findOne({ email: email });
        if (!user) {
            return res.status(401).send("Invalid credentials."); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials."); 
        }

        const token = generateToken(user);
        // console.log('Generated Token:', token);

        res.cookie("token", token, { httpOnly: true }); 
        return res.redirect("/user/home"); 

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal server error."); 
    }
};




module.exports.logout = function(req, res) {
    try {
       
        res.clearCookie("token"); 
        res.redirect("/login");
    } catch (err) {
        console.error("Error during logout:", err.message);
        res.status(500).send("Internal server error"); 
    }
};




// module.exports.Home = async function(req, res) {
//     try {
//         // Assuming req.user contains the logged-in user's info
//         const userEmail = req.user.email; // Or however you are storing user info
//         const user = await usermodel.findOne({ email: userEmail }).populate("cart");

//         res.render("home", { user });
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Internal server error");
//     }
// };

module.exports.Home = async function(req, res) {
    try {
        const userEmail = req.user.email; 
        const user = await usermodel.findOne({ email: userEmail });

        const products = await productmodel.find().limit(10);
        const product = await productmodel.find({category:'Trending'});
                  

        res.render("home", { user, products,product });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
};

