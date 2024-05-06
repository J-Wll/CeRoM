const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
    name: String,
    status: String,
    handledBy: String,
    customerLogs: String
})

module.exports = mongoose.model("Customer", Customer)