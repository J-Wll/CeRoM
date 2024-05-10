const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, async (req, res) => {
    const sortBy = req.query.sortBy || "_id";
    const sortDir = parseInt(req.query.sortDir) || 1;
    const limit = req.query.limit || 10;

    // COULD MOVE ALL OF THIS INTO CRUD CONTROLLER, PASS IN ALL THESE ARGS AS AN OBJ
    const items = await crudController.getAll(req, res, "product", limit, sortBy, sortDir);

    res.render("items", {
        data: items,
        title: "Products",
        noEdit: ["_id", "__v"],
        sortedBy: sortBy,
        sortedDir: sortDir,
        limited: limit,
        createPath: "/products/create"
    })
})


router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "product", "/products");
});

module.exports = router;
