const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const checkAuth = require("../middleware/checkAuth");
const itemsRender = require("../js/itemsRender");
const hashPassword = require('../js/hashPassword');
const bodyParser = require('body-parser');

router.get("/", checkAuth, async (req, res) => {
    const args = {
        title: "Employees",
        noEdit: ["_id", "__v", "encrypted_pass"],
        basePath: "/employees",
        admin: req.session.admin,
        notEditable: true
    }
    itemsRender(req, res, "employee", args);
})

router.post('/create', checkAuth, bodyParser.json(), async (req, res) => {
    const hashedPassword = await hashPassword(req.body.password);
    console.log("HHH", hashedPassword);
    req.body.password = hashedPassword;
    await crudController.create(req, res, this, "employee", "/employees");
});

module.exports = router;
