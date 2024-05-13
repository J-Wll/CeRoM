const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");

router.get("/", check.login, check.read, async (req, res) => {
    const args = {
        title: "Customers",
        noEdit: ["_id", "__v", "Customer logs"],
        basePath: "/customers",
        description: "To view and edit customer logs, click on view/edit on the customer"
    }
    itemsRender(req, res, "customer", args);
})

router.post('/create', check.login, check.create, async (req, res) => {
    await crudController.create(req, res, this, "customer", "/customers");
});

module.exports = router;
