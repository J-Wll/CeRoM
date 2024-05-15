const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

router.get("/", check.login, check.read, async (req, res) => {
    const args = {
        title: "Products",
        noEdit: ["_id", "__v"],
        basePath: "/products",
        description: "Products"
    }
    itemsRender(req, res, "product", args);
})

router.get("/:id", check.login, check.read, async (req, res) => {
    const args = {
        title: "Product:",
        nameField: "name",
        noEdit: ["_id", "__v"],
        editPath: "/products/edit",
        editInclude: "Products"
    }
    singleItemRender(req, res, "product", req.params.id, args);
})

router.post('/create', check.login, check.create, async (req, res) => {
    await crudController.create(req, res, this, "product", "/products");
});

module.exports = router;
