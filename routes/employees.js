var express = require('express');
var router = express.Router();

const getData = require("../middleware/getData")

router.get("/", (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    const productData = getData("../data/employee_data.json", sortBy, sortDir);

    res.render("products", {
        data: productData,
        title: "Employees"
    })
})

module.exports = router;
