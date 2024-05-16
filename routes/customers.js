const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

const BASEPATH = "/customers";
const MODELNAME = "customer";

router.get("/", check.login, check.read, async (req, res) => {
    const products = await crudController.getRaw(req, res, "product", "name")
    const employees = await crudController.getRaw(req, res, "employee", "username")
    console.log(products, employees)
    const args = {
        title: "Customers",
        basePath: BASEPATH,
        description: "To view and edit customer logs, click view/edit on the customer",
        products: products,
        employees: employees
    }
    itemsRender(req, res, MODELNAME, args);
})

router.get("/:id", check.login, check.read, async (req, res) => {
    const args = {
        title: "Customer:",
        nameField: "name",
        noEdit: ["_id", "__v"],
        editPath: `${BASEPATH}/edit`,
        editInclude: "Customers"
    }
    singleItemRender(req, res, MODELNAME, req.params.id, args);
})

router.post("/update/:id", check.login, check.update, async (req, res) => {
    crudController.update(req, res, MODELNAME, req.params.id);
    res.redirect(`${BASEPATH}/:${req.params.id}`);
})

router.get("/delete/:id", check.login, check.del, async (req, res) => {
    crudController.del(req, res, MODELNAME);
    res.redirect(BASEPATH);
})

async function productMapping(req, res, interestedIn) {
    let interestedInProducts = [];
    if (Array.isArray(interestedIn)) {
        // Convert each product_id to an object containing product_id and product_name
        for (const product of interestedIn) {
            const productInfo = await crudController.getOneRaw(req, res, "product", product, "name");
            interestedInProducts.push({
                product_id: productInfo._id,
                product_name: productInfo.name
            });
        }
    } else {
        // If only one product selected, convert it to an array of object containing product_id and product_name
        const productInfo = await crudController.getOneRaw(req, res, "product", interestedIn, "name");
        interestedInProducts = [{
            product_id: productInfo._id,
            product_name: productInfo.name
        }];
    }
    return interestedInProducts;
}

router.post('/create', check.login, check.create, async (req, res) => {
    req.body.interested_in = await productMapping(req, res, req.body.interested_in);

    const handledByEmployee = await crudController.getOneRaw(req, res, "employee", req.body.handled_by, "username");
    req.body.handled_by = {
        employee_id: handledByEmployee._id,
        employee_username: handledByEmployee.username
    };

    console.log(req.body)

    await crudController.create(req, res, this, MODELNAME, BASEPATH);
});

module.exports = router;
