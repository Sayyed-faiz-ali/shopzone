const mongoose=require("mongoose");

const ownerSchema=mongoose.Schema({
    fullname: {
      type:String,
    },
    email: {
     type: String
    },
    password:{
      type: String
      
    },

    products:{
    type:Array,
    default:[]
  },
  
  Picture:String,

});
module.exports=mongoose.model("owner",ownerSchema);