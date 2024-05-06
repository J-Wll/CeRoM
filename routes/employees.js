var express = require('express');
var router = express.Router();

const getData = require("../js/getData")

router.get("/", (req, res) => {
    if (!req.session.isAuthenticated) {
        req.session.flash = ({
            type: "error",
            message: "Login required"
        })
        res.redirect("/login");
    }

    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    const productData = getData("../data/employee_data.json", sortBy, sortDir);

    res.render("products", {
        data: productData,
        title: "Employees"
    })
})

module.exports = router;
