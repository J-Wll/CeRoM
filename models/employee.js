const mongoose = require("mongoose");

const Employee = new mongoose.Schema({
    name: String,
    username: String,
    encrypted_pass: String
})

module.exports = mongoose.model("Employee", Employee)