const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

const BASEPATH = "/products";
const MODELNAME = "product";

function formatData(data) {
    function formatInner(item) {
        for (header in item) {
            if (header === "price") {
                item[header] = `£${item[header]}`
            }
        }
        return item;
    }

    console.log("start: ", data);

    if (Array.isArray(data)) {
        for (item of data) {
            item = formatInner(item);
        }
    } else {
        data = formatInner(data);
    }

    console.log("end: ", data);
    return data;
}

router.get("/", check.login, check.read, async (req, res) => {
    const args = {
        title: "Products",
        basePath: BASEPATH,
        description: "Products"
    }
    itemsRender(req, res, MODELNAME, args, formatData);
})

router.get("/:id", check.login, check.read, async (req, res) => {
    const args = {
        title: "Product:",
        nameField: "name",
        noEdit: ["_id", "__v"],
        editPath: `${BASEPATH} /edit`,
        editInclude: "Products"
    }
    singleItemRender(req, res, MODELNAME, req.params.id, args, formatData);
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
