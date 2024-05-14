const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    sales: { type: Number, required: true },
})

module.exports = mongoose.model("Product", Product)

