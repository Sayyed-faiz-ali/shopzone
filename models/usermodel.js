const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cart: [CartItemSchema], 
    orders: { type: Array, default: [] },
    contactno: { type: String },
    Picture: { type: Buffer, default: "total.png" }
});

module.exports = mongoose.model("User", userSchema);
