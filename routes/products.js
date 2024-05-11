const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

router.get("/", checkAuth, async (req, res) => {
    const args = {
        title: "Products",
        noEdit: ["_id", "__v"],
        basePath: "/products"
    }
    itemsRender(req, res, "product", args);
})

router.get("/:id", checkAuth, async (req, res) => {
    const args = {
        title: "Products",
        noEdit: ["_id", "__v"],
        editPath: "/products/edit"
    }
    singleItemRender(req, res, "product", req.params.id, args);
})

router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "product", "/products");
});

module.exports = router;
