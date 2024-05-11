const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const itemsRender = require("../js/itemsRender");

router.get("/", checkAuth, async (req, res) => {
    const args = {
        title: "Products",
        noEdit: ["_id", "__v"],
        createPath: "/products/create"
    }
    itemsRender(req, res, "product", args);
})

router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "product", "/products");
});

module.exports = router;
