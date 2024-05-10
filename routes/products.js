const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const tableSort = require("../js/tableSort")

router.get("/", checkAuth, async (req, res) => {
    const sortBy = req.query.sortBy || "_id";
    const sortDir = parseInt(req.query.sortDir) || 1;
    const limit = req.query.limit || 10;

    let items = await crudController.getAll(req, res, "product", limit, sortBy, sortDir);

    res.render("items", {
        data: items,
        title: "Products",
        noEdit: ["_id", "__v"],
        model: "product",
        sortedBy: sortBy,
        sortedDir: sortDir,
        limited: limit
    })
})



// router.post("/create", crudController.create);
router.post('/create/:model', checkAuth, crudController.create);

router.get('/get/:model', crudController.getAll);

module.exports = router;
