const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const itemsRender = require("../js/itemsRender");

router.get("/", checkAuth, async (req, res) => {
    const args = {
        title: "Employees",
        noEdit: ["_id", "__v", "encrypted_pass"],
        basePath: "/employees",
        admin: req.session.admin,
    }
    itemsRender(req, res, "employee", args);
})

router.post('/create', checkAuth, async (req, res) => {
    await crudController.create(req, res, this, "employee", "/employees");
});

module.exports = router;
