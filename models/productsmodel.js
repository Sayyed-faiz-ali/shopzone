const mongoose=require("mongoose");
const productSchema=mongoose.Schema({
    image: Buffer,

    name: String,
    price:Number,
    discount:{
        type :Number,
        default:0
    },
    description :{
      type :String,
      
     
  },
  category:{
    type:String,
    enum:['Men','Women','Accessories','Trending'],
   required:true,
   default:0
  },
  size:[{
    type:String,
    enum:['S','M','L','XL'],
    required:true, 
 
 }],
  rating:{
type:Number,
default:0

  },

  Images:{
  type:Buffer,
},
 

  
  bgcolor:String,
  parentcolor:String,
  textcolor:String,


});
module.exports=mongoose.model("product",productSchema);