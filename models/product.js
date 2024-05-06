const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: String,
    price: Number
})

module.exports = mongoose.model("Product", Product)

