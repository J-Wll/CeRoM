const mongoose = require("mongoose");

const Employee = new mongoose.Schema({
    name: String,
    username: String,
    encryptedPass: String
})

module.exports = mongoose.model("Employee", Employee)