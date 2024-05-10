const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, async (req, res) => {
    const sortBy = req.query.sortBy || "_id";
    const sortDir = parseInt(req.query.sortDir) || 1;
    const limit = req.query.limit || 10;

    const items = await crudController.getAll(req, res, "employee", limit, sortBy, sortDir);

    res.render("items", {
        data: items,
        title: "Employees",
        noEdit: ["_id", "__v", "Password hash"],
        sortedBy: sortBy,
        sortedDir: sortDir,
        limited: limit,
        createPath: "/employees/create"
    })

    const Model = require("../models/product");
    const fields = Object.keys(Model.schema.paths);
    console.log(fields);

})

router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "employee", "/employees");
});

module.exports = router;
