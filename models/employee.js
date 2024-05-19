const mongoose = require("mongoose");

const Employee = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    permissions: {
        read: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        rootAdmin: { type: Boolean, default: false },
        admin: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model("Employee", Employee);