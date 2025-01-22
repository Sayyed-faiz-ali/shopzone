const express=require("express");
const router=express.Router();
const {registeruser}  = require("../controllers/authcontoller")
const {loginUser} = require("../controllers/authcontoller")
const {logout} =require("../controllers/authcontoller")
const {Home} = require("../controllers/authcontoller")
const isLogged = require("../middleware/islogin");
const productmodel = require("../models/productsmodel");
const islogin = require("../middleware/islogin");
router.get("/",function(req,res){
    res.send("hey ey")
})
router.post("/register",registeruser)

router.post("/login",loginUser)
router.get("/logout",logout)

router.get("/home",isLogged ,Home);





module.exports=router;