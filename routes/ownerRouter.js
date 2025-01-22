const express=require("express");
const router=express.Router();
const ownermodel=require('../models/ownermodel');
const productmodel = require('../models/productsmodel');
const usermodel = require('../models/usermodel');
const bcrypt = require("bcrypt");
const { route } = require(".");
// const islogged = require("../middleware/looged");
const { cache } = require("ejs");
const token = require("jsonwebtoken");
const addressmodel = require("../models/addressmodel");
// only development phase

// if(process.env.NODE_ENV =="development"){
router.post("/create",async function(req,res){
    try{

        let Number=await ownermodel.find();
        if(Number.length > 0){
            return res.status(200).send("they do not here permission");
    }
    let { fullname,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let CreateOwner = await ownermodel.create({
        fullname,
        email,
        password:hashedPassword,
    });
    res.redirect("/owner/req");
}
catch(err){
    console.log(err.message);
    

}


    
});



router.post("/login",async (req, res) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password required.");
        }

        const user = await ownermodel.findOne({ email: email });
        
        if (!user) {
            return res.status(401).send("Invalid credentials."); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).send("Invalid credentials.xxx"); 
        }


        res.cookie("token", token, { httpOnly: true }); 
        return res.redirect("/owner/admin"); 

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Internal server error."); 
    }
});


router.get("/logout",async function(req,res){
    try {
       
        res.clearCookie("token"); 
        res.redirect("/owner/login");
    } catch (err) {
        console.error("Error during logout:", err.message);
        res.status(500).send("Internal server error"); 
    }


});

router.get("/reg",(req,res)=>{
    res.render("ownerlogin");
});
router.get("/login",(req,res)=>{
    res.render("ownerreg");
});

router.get("/admin",async function(req,res){

    res.render("product")
});
router.get("/product",async function(req,res){
    let product = await productmodel.find();

    res.render("owner",{product});

});

router.get("/profile",async function(req,res){
    let user = await ownermodel.find();

    res.render("owner.profile.ejs",{user});

});



router.get("/men",async function(req,res) {
    try{
       let product = await productmodel.find({category:'Men'});
          
       
   res.render("ownermen",{product});
   }
   catch(err){
       console.log(err)
   }
   });
   
   router.get("/Women" ,async function(req,res) {
       try{
          let product = await productmodel.find({category:'Women'});
             
      res.render("ownerwomen",{product});
      }
      catch(err){
          console.log(err)
      }
      });
   
   router.get("/Accessories",async function(req,res) {
       try{
          let product = await productmodel.find({category:'Accessories'});
             
      res.render("owneracc",{product});
      }
      catch(err){
          console.log(err)
      }
      });


    // user data
 
    router.get("/user",async function(req, res) {
        try {
            let user = await usermodel.find();
            let add = await addressmodel.find();
    
            res.render("owneruser", { user,add });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Something went wrong while fetching users.");
        }
    });

// del product 
router.get("/delete/:id",async (req, res) => {
    try {
        const product = await productmodel.findOneAndDelete({ _id: req.params.id });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.redirect("/owner/product");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

    
module.exports=router;