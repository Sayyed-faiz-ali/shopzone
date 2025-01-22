const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: { type: String, 
        required: true 
    },
    email: { type: String, 
        required: true 
    
     },
    password: { type: String, required: true },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,ref: "product",
            quantity: { type: Number, default: 1 }
        },
    ],
  

    orders: {
        type: Array,
        default: [],
    },
  
    contactno: { type: String },
    Picture: {
        type:Buffer,
        default:"total.png",
        },
});

module.exports = mongoose.model("user", userSchema);
