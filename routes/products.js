const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

const BASEPATH = "/products";
const MODELNAME = "product";

router.get("/", check.login, check.read, async (req, res) => {
    const args = {
        title: "Products",
        basePath: BASEPATH,
        description: "Products"
    }
    itemsRender(req, res, MODELNAME, args);
})

router.get("/:id", check.login, check.read, async (req, res) => {
    const args = {
        title: "Product:",
        nameField: "name",
        noEdit: ["_id", "__v"],
        editPath: `${BASEPATH}/edit`,
        editInclude: "Products"
    }
    singleItemRender(req, res, MODELNAME, req.params.id, args);
})

router.post("/update/:id", check.login, check.update, async (req, res) => {
    crudController.update(req, res, MODELNAME, req.params.id);
    res.redirect(`${BASEPATH}/${req.params.id}`)
})

router.get("/delete/:id", check.login, check.del, async (req, res) => {
    crudController.del(req, res, MODELNAME);
    res.redirect(BASEPATH);
})

router.post('/create', check.login, check.create, async (req, res) => {
    await crudController.create(req, res, this, MODELNAME, BASEPATH);
});

module.exports = router;
