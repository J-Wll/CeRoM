const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const getData = require("../js/getData")

router.get("/", checkAuth, (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    const items = getData("../data/employee_data.json", sortBy, sortDir);

    res.render("items", {
        data: items,
        title: "Employees",
        noEdit: ["ID", "Password hash"],
        model: "employee"
    })
})

module.exports = router;
