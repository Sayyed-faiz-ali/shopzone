const express = require("express");
const router = express.Router();
const isLogged = require("../middleware/islogin")
const userModel = require("../models/usermodel");
const productmodel =require("../models/productsmodel");
const addressmodel = require("../models/addressmodel");
const alert = require("alert-node");
const upload = require("../config/multer-config");
const mongoose = require('mongoose');
const { logout } = require("../controllers/authcontoller");

router.get("/",function(req,res){

    res.render("create");
})
router.get("/login",function(req,res){
    res.render("login")
});


router.get("/shop",isLogged,async function(req, res) {
    try {
        let product = await productmodel.find();
        
        res.render("shop", { product });
       
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving products.");
    }
});




// cart 

    router.get("/cart", isLogged, async function(req, res) {
        try {
            let user = await userModel.findOne({ email: req.user.email }).populate('cart');
        
    
    // let product = await productmodel.find();

    // let existingProduct = user.cart.find(item => {
    //                 console.log("Checking item.productId: ", item.req.productid);  // Log each item in the cart
    //                 return item.req.productid === product;  // Compare productIds
    //             });
    // console.log(existingProduct);

            const bill = user.cart.map(item => {
                const price = Number(item.price);
                const discount = Number(item.discount);
                const quantity = Number(item.quantity) || 1; 
                
                
                const itemTotal = (price - discount) * quantity;
                return itemTotal; 
                
            });

            const totalBill = bill.reduce((acc, curr) => acc + curr, 0);

            res.render("cart", { user, totalBill });

        } catch (error) {
            console.error("Error fetching cart:", error);
            res.status(500).send("Internal Server Error");
        }
    });



// cart del
router.post("/cart/delete/:itemId", isLogged, async function(req, res) {
    try {
        const itemId = req.params.itemId;
        const userEmail = req.user.email;

        const user = await userModel.findOneAndUpdate(
            { email: userEmail },
            { $pull: { cart: itemId } },
            { new: true } 
        ).populate("cart");

        
        const bill = user.cart.map(item => {
            const price = Number(item.price);
            const discount = Number(item.discount);
            return price - discount;
            
        });
        const totalBill = bill.reduce((acc, curr) => acc + curr, 0);

        res.render("cart", { user,totalBill });
       

    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).send("Internal Server Error");
    }
});

// add to cart rout
router.get("/addtocart/:productid",isLogged,async function(req,res){
    let user = await userModel.findOne({email:req.user.email});
   
    if (!user) return res.status(401).send("Invalid email or password");
      user.cart.push(req.params.productid);

      
        
   await user.save();
    res.redirect("/shop");
    alert("card added suceesfully")
   
});






router.get("/cart/buy/:productid",isLogged,async function (req,res) {
    const { productId } = req.params; 
    

    // res.send("wait..........")
  
    
res.render("success")
})


router.get("/profile",isLogged,async function(req,res){
    let user = await userModel.findOne({email:req.user.email})
    res.render("profile",{user})
    // console.log(user)
})




router.post("/update",isLogged,upload.single("image"),async function(req,res){
    let user = await userModel.findOneAndUpdate({email:req.user.email} );
    user.Picture = req.file.buffer;
   await user.save();
   
    //  res.render("profile",{user})
    res.redirect("/profile")
    console.log(user);
    
    
})


router.get("/item/:productid", isLogged, async function(req, res) {
    try {
        const { productid } = req.params;  
       

        if (!mongoose.Types.ObjectId.isValid(productid)) {
            return res.status(400).send("Invalid Product ID format. It must be a 24-character hex string.");
        }

        
        const objectId = new mongoose.Types.ObjectId(productid);

        const productDetails = await productmodel.findById(objectId);

        if (!productDetails) {
            return res.status(404).send("Product not found");
        }

        res.render("ITEM", { product: productDetails });
    } catch (err) {
        console.error("Error fetching product:", err.message);
        res.status(500).send("Internal server error");
    }
});


router.post('/checkout',isLogged,async (req,res)=>{
    try{
           
            let {fullname,email,contactno,address, location } =req.body;
        let addes = await addressmodel.create({
            fullname,
            email,
            contactno,
            address,
            location
        });
res.redirect("/checkout")        

    }
    catch(err){
        console.log(err.message);
        
    }
});
router.get("/checkout", isLogged, async function(req, res) {
    let addes = await addressmodel.findOne();
    let user = await userModel.findOne({email:req.user.email});

res.render("address",{addes,user}); 
});




router.post("/product/size",isLogged,async function(req,res){
try{
    let {size} = req.body;
    let product = await productmodel.findOne({size:req.product.size});
    // res.render("ITEM",{product}); 
    console.log(product);
    
}
catch(err){
    console.log(err.message);
}
});



// // router.post("/mul", upload.array('image', 3), async (req, res) => { 
//     if (req.files && req.files.length > 0) {
//         const images = req.files.map(file => {
//             return {
//                 originalname: file.originalname,
//                 buffer: file.buffer
//             };
//         });


//         res.render("X2", { x:images});  
//     } else {
//         res.send('No files uploaded.');
//     }
// // });

// router.get("/up",async(req,res)=>{
//     res.render("X");
// })




module.exports=router;