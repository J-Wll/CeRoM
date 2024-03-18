var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const tableSort = require("../public/js/tableSort")

const file = fs.readFileSync(
    path.resolve(__dirname, "../data/product_data.json")
);
const productData = JSON.parse(file);

router.get("/", (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    res.render("products", {
        data: tableSort(productData, sortBy, sortDir),
        title: "Products"
    })
})

module.exports = router;
