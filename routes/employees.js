const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");
const hashPassword = require('../js/hashPassword');
const bodyParser = require('body-parser');

const BASEPATH = "/employees";
const MODELNAME = "employee";

function formatData(data, doExtras = true) {
    function formatInner(item) {
        for (header in item) {
            if (header === "permissions") {
                if (doExtras) {
                    item.extras = { permissions: item[header] };
                }
                let perms = []
                if (item[header].rootAdmin) { perms.push(" Root Admin") };
                if (item[header].admin) { perms.push(" Admin") };
                if (item[header].create) { perms.push(" Create") };
                if (item[header].read) { perms.push(" Read") };
                if (item[header].update) { perms.push(" Update") };
                if (item[header].delete) { perms.push(" Delete") };
                item[header] = perms;
            }
        }
        return item;
    }


    if (Array.isArray(data)) {
        for (item of data) {
            item = formatInner(item);
        }
    } else {
        data = formatInner(data);
    }


    return data;
}


router.get("/", check.login, check.admin, check.read, async (req, res) => {
    const args = {
        title: "Employees",
        noEdit: ["_id", "__v", "encrypted_pass"],
        basePath: BASEPATH,
        admin: req.session.admin,
        notEditable: true,
        description: "Employees must be added via the registration form by an admin. Permissions can be viewed and changed by clicking view/edit. Only the permissions, name and contact details can be changed. Passwords should be changed by the users and their username is fixed as it is linked to products and logs.",
        rootAdmin: req.session.rootAdmin
    }
    const fields = "name username permissions";
    itemsRender(req, res, MODELNAME, args, formatData, fields);
})

router.get("/:id", check.login, check.admin, check.read, async (req, res) => {
    const args = {
        title: "Employee:",
        nameField: "username",
        editPath: `${BASEPATH}/edit`,
        editInclude: "Employees"
    }
    const fields = "name username permissions";
    singleItemRender(req, res, MODELNAME, req.params.id, args, formatData, fields);
})

router.post("/update/:id", check.login, check.admin, check.update, async (req, res) => {
    if (req.body.password || req.body.username) {
        delete req.body.password;
        delete req.body.username;
        req.session.flash = {
            type: "error",
            message: "Can't change username or pass",
        };
        return res.redirect(req.get("referer"));
    }

    req.body.permissions = JSON.parse(req.body.permissions);
    // admins implicitly get all permissions (other than root admin)
    if (req.body.permissions.admin || req.body.permissions.rootAdmin) {
        if (!req.session.rootAdmin) {
            req.session.flash = {
                type: "error",
                message: "Root admin needed for adding an admin",
            };
            return res.redirect(req.get("referer"));
        }
        req.body.permissions.read = true;
        req.body.permissions.create = true;
        req.body.permissions.update = true;
        req.body.permissions.delete = true;
    }

    crudController.update(req, res, MODELNAME, req.params.id);
    res.redirect(`${BASEPATH}/${req.params.id}`);
})

router.get("/delete/:id", check.login, check.admin, check.del, async (req, res) => {
    crudController.del(req, res, MODELNAME);
    res.redirect(BASEPATH);
})

router.post("/firstCreate", async (req, res) => {
    // This only works if employees.length is 0, that's how it is protected
    if (req.body.password.length < 8) {
        req.session.flash = {
            type: "error",
            message: "Password not long enough (needs to be >= 8)",
        };
        return res.redirect(req.get("referer"));
    }
    const employees = await crudController.getRaw(req, res, "employee", "username");
    if (employees.length === 0) {
        req.body.permissions = {
            rootAdmin: true,
            admin: true,
            create: true,
            read: true,
            update: true,
            delete: true,
        }

        req.body.password = await hashPassword(req.body.password);
        crudController.createRaw(req, res, "employee")
        return res.redirect("/");
    }
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
    const existingEmployees = await crudController.getAll(req, res, MODELNAME,);

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
    if (req.body.permissions.admin || req.body.permissions.rootAdmin) {
        if (!req.session.rootAdmin) {
            req.session.flash = {
                type: "error",
                message: "Root admin needed for adding an admin",
            };
            return res.redirect(req.get("referer"));
        }
        req.body.permissions.read = true;
        req.body.permissions.create = true;
        req.body.permissions.update = true;
        req.body.permissions.delete = true;
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    await crudController.create(req, res, this, MODELNAME, BASEPATH);
});

module.exports = router;
