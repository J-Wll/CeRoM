const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    handled_by: {
        type:
        {
            employee_id: mongoose.Schema.Types.ObjectId,
            employee_username: String
        },
        required: true
    },
    interested_in: [{
        product_id: mongoose.Schema.Types.ObjectId,
        product_name: String
    }],
    customer_logs: [{
        contact_type: String,
        contact_datetime: String,
        contact_medium: String,
        contact_description: String
    }]

})

module.exports = mongoose.model("Customer", Customer)