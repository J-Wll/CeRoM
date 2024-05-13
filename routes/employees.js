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
        notEditable: true,
        description: "Employees must be added via the registration form"
    }
    itemsRender(req, res, "employee", args);
})

router.post('/create', checkAuth, bodyParser.json(), async (req, res) => {
    // Admin needed for creating employees
    if (!req.session.admin) {
        req.session.flash = {
            type: "error",
            message: "Missing required permissions",
        };
        return res.redirect(req.get("referer"));
    }

    if (req.body.password.length < 8) {
        req.session.flash = {
            type: "error",
            message: "Password not long enough (needs to be >= 8)",
        };
        return res.redirect(req.get("referer"));
    }

    const username = req.body.username;
    const existingEmployees = await crudController.getAll(req, res, "employee",);

    for (i in existingEmployees) {
        if (existingEmployees[i].username.toLowerCase() == username.toLowerCase()) {
            req.session.flash = {
                type: "error",
                message: "Username already exists, needs to be unique",
            };
            return res.redirect(req.get("referer"));
        }
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    console.log(req.body);
    await crudController.create(req, res, this, "employee", "/employees");
});

module.exports = router;
