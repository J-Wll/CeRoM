const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const tableSort = require("../js/tableSort")

router.get("/", checkAuth, async (req, res) => {
    const sortBy = req.query.sortBy || "ID";
    const sortDir = req.query.sortDir || "asc";

    let items = await crudController.getAll(req, "product");
    items = tableSort(items, sortBy, sortDir);
    console.log("ffff" + items + "bbbb");

    res.render("items", {
        data: items,
        title: "Products",
        noEdit: ["ID", "_id", "__v"],
        model: "product"
    })
})



// router.post("/create", crudController.create);
router.post('/create/:model', crudController.create);

router.get('/get/:model', crudController.getAll);

module.exports = router;
