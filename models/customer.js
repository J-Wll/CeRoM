const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
    name: String,
    status: String,
    handled_by: String,
    customer_logs: String
})

module.exports = mongoose.model("Customer", Customer)