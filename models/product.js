const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: String,
    price: Number,
    sales: Number
})

module.exports = mongoose.model("Product", Product)

