const mongoose = require("mongoose");

const addSchema = mongoose.Schema({
    fullname: { type: String, 
        required: true 
    },
   email:{
    type:String
   },
    contactno: { type: Number },
    address:{
        type:String,
    },
    location:{
        type:String,
        default:"kanpur"
    }
    
});

module.exports = mongoose.model("address", addSchema);
