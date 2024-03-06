var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

const file = fs.readFileSync(
    path.resolve(__dirname, "../data/product_data.json")
);
const productData = JSON.parse(file);

router.get("/", (req, res) => {
    res.render("products", {
        data: productData,
        title: "Products"
    })
})

module.exports = router;
