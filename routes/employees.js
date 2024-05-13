const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const hashPassword = require('../js/hashPassword');
const bodyParser = require('body-parser');

router.get("/", check.login, check.read, async (req, res) => {
    const args = {
        title: "Employees",
        noEdit: ["_id", "__v", "encrypted_pass"],
        basePath: "/employees",
        admin: req.session.admin,
        notEditable: true,
        description: "Employees must be added via the registration form by an admin. Permissions can be viewed and changed by clicking view/edit on a single item"
    }
    itemsRender(req, res, "employee", args);
})

router.post('/create', check.login, check.admin, check.create, bodyParser.json(), async (req, res) => {
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

    req.body.permissions = JSON.parse(req.body.permissions);
    // admins implicitly get all permissions (other than root admin)
    if (req.body.admin || req.body.rootAdmin) {
        if (!req.session.rootAdmin) {
            req.session.flash = {
                type: "error",
                message: "Root admin needed for adding an admin",
            };
            return res.redirect(req.get("referer"));
        }
        req.body.read = true;
        req.body.create = true;
        req.body.update = true;
        req.body.delete = true;
        req.body.viewSensitive = true;
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    console.log(req.body);
    await crudController.create(req, res, this, "employee", "/employees");
});

module.exports = router;
