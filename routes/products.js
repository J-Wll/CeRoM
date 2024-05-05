var express = require('express');
var router = express.Router();

const getData = require("../js/getData")

router.get("/", (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    const productData = getData("../data/product_data.json", sortBy, sortDir);

    res.render("products", {
        data: productData,
        title: "Products"
    })
})

module.exports = router;
