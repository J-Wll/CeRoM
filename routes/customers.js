// Basically just repeats product router, make more DRY with middleware
var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const tableSort = require("../public/js/tableSort")

const file = fs.readFileSync(
    path.resolve(__dirname, "../data/customer_data.json")
);
const customerData = JSON.parse(file);

router.get("/", (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    res.render("products", {
        data: tableSort(customerData, sortBy, sortDir),
        title: "Customers"
    })
})

module.exports = router;
