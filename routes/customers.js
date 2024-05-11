const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const itemsRender = require("../js/itemsRender");

router.get("/", checkAuth, async (req, res) => {
    const args = {
        title: "Customers",
        noEdit: ["_id", "__v", "Customer logs"],
        basePath: "/customers"
    }
    itemsRender(req, res, "customer", args);
})

router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "customer", "/customers");
});

module.exports = router;
