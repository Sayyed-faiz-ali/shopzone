const express= require("express");
const router=express.Router();
const productmodel=require("../models/productsmodel")
const upload = require("../config/multer-config")
const islogged =require("../middleware/islogin")
const usermodel = require("../models/usermodel");
const alert = require("alert-node");



// router.get("/shop", async function(req, res) {
//     try {
//         let product = await productmodel.find();
//         res.render("shop", { product });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occurred while retrieving products.");
//     }
// });


router.post("/shop/create",upload.single("image"),async  function(req,res){

try{
    let  {name ,price,discount,description,category,rating,bgcolor,parentcolor,textcolor} =req.body
    let product = await productmodel.create({
        image:req.file.buffer,
        name,
        price,
        discount,
        description,
        category,
        rating,
        bgcolor,
        parentcolor,
        textcolor,
})

// if(category === 'Men') {
//     res.redirect('/men');
//   } else if (category === 'Women') {
//     res.redirect('/women');
//   } else if (category === 'Accessories') {
//     res.redirect('/accessories');
//   } else {
//     res.status(400).send('Invalid category');
//   }
  alert("sucessfully added ")
res.redirect("/owner/admin") 
 
}
catch(err){
    res.send(err.message);
}
});


    

    
 
    



router.get("/men", islogged,async function(req,res) {
 try{
    let product = await productmodel.find({category:'Men'});
       
res.render("men",{product});
}
catch(err){
    console.log(err)
}
});

router.get("/Women", islogged ,async function(req,res) {
    try{
       let product = await productmodel.find({category:'Women'});
          
   res.render("Women",{product});
   }
   catch(err){
       console.log(err)
   }
   });

router.get("/Accessories", islogged,async function(req,res) {
    try{
       let product = await productmodel.find({category:'Accessories'});
          
   res.render("acc",{product});
   }
   catch(err){
       console.log(err)
   }
   });


// router.post("/mul", upload.array('image', 3), async (req, res) => { 
//         if (req.files && req.files.length > 0) {
//             const images = req.files.map(file => {
//                 return {
//                     originalname: file.originalname,
//                     buffer: file.buffer
//                 };
//             });
//     // 
          
    
//             res.render("X2", { x:images});  
//         } else {
//             res.send('No files uploaded.');
//         }
//     });

//     router.get("/up",async(req,res)=>{
//         res.render("X");
//     })
module.exports=router;