const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const check = require("../middleware/check");
const itemsRender = require("../js/itemsRender");
const singleItemRender = require("../js/singleItemRender");

const BASEPATH = "/customers";
const MODELNAME = "customer";

const customer = require(`../models/${MODELNAME}`);

function formatData(data, doExtras = true) {
    function formatInner(item) {
        if (doExtras) {
            item.extras = {};
        }
        for (header in item) {
            if (header === "handled_by") {
                item[header] = item[header].employee_username;
            }
            if (header === "interested_in") {
                if (doExtras) {
                    item.extras[header] = []
                }
                for (i in item[header]) {
                    if (doExtras) {
                        item.extras[header].push(item[header][i]);
                    }
                    item[header][i] = item[header][i].product_name;
                }
            }
            if (header === "customer_logs") {
                // Keep the full ones for the other view
                // item["full-logs"] = item[header];
                if (doExtras) {
                    item.extras.fullLogs = item[header]
                }
                item[header] = `${item[header].length} entries`
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

router.get("/", check.login, check.read, async (req, res) => {
    const products = await crudController.getRaw(req, res, "product", "name")
    const employees = await crudController.getRaw(req, res, "employee", "username")
    const args = {
        title: "Customers",
        basePath: BASEPATH,
        description: "To view and edit customer logs, click view/edit on the customer",
        products: products,
        employees: employees
    }
    itemsRender(req, res, MODELNAME, args, formatData);
})

router.get("/:id", check.login, check.read, async (req, res) => {
    const products = await crudController.getRaw(req, res, "product", "name")
    const employees = await crudController.getRaw(req, res, "employee", "username")
    const args = {
        title: "Customer:",
        nameField: "name",
        noEdit: ["_id", "__v"],
        editPath: `${BASEPATH}/edit`,
        editInclude: "Customers",
        products: products,
        employees: employees
    }
    singleItemRender(req, res, MODELNAME, req.params.id, args, formatData);
})

router.post("/update/:id", check.login, check.update, async (req, res) => {
    req.body.interested_in = await productMapping(req, res, req.body.interested_in);

    const handledByEmployee = await crudController.getOneRaw(req, res, "employee", req.body.handled_by, "username");
    req.body.handled_by = {
        employee_id: handledByEmployee._id,
        employee_username: handledByEmployee.username
    };

    crudController.update(req, res, MODELNAME, req.params.id);
    res.redirect(`${BASEPATH}/${req.params.id}`);
})

router.get("/delete/:id", check.login, check.del, async (req, res) => {
    crudController.del(req, res, MODELNAME);
    res.redirect(BASEPATH);
})

router.post('/create', check.login, check.create, async (req, res) => {
    req.body.interested_in = await productMapping(req, res, req.body.interested_in);

    const handledByEmployee = await crudController.getOneRaw(req, res, "employee", req.body.handled_by, "username");
    req.body.handled_by = {
        employee_id: handledByEmployee._id,
        employee_username: handledByEmployee.username
    };

    await crudController.create(req, res, this, MODELNAME, BASEPATH);
});
// LOGS
router.post("/create-log/:id", check.login, check.create, async (req, res) => {
    const { contact_type, contact_datetime, contact_medium, contact_description } = req.body;

    try {
        await customer.findByIdAndUpdate(req.params.id, {
            $push: {
                customer_logs: {
                    contact_type,
                    contact_datetime,
                    contact_medium,
                    contact_description
                }
            }
        });
    } catch (err) {
        console.error(err);
    }

    res.redirect(`${BASEPATH}/${req.params.id}`);
})

router.post("/edit-log/:id/:logID", check.login, check.update, async (req, res) => {
    const { contact_type, contact_datetime, contact_medium, contact_description } = req.body;

    try {
        await customer.updateOne(
            { _id: req.params.id, "customer_logs._id": req.params.logID },
            {
                $set: {
                    "customer_logs.$.contact_type": contact_type,
                    "customer_logs.$.contact_datetime": contact_datetime,
                    "customer_logs.$.contact_medium": contact_medium,
                    "customer_logs.$.contact_description": contact_description
                }
            }
        );
    } catch (err) {
        console.error(err);
    }

    res.redirect(`${BASEPATH}/${req.params.id}`);
})

router.get("/delete-log/:id/:logID", check.login, check.del, async (req, res) => {

    try {
        await customer.findByIdAndUpdate(req.params.id, {
            $pull: {
                customer_logs: { _id: req.params.logID }
            }
        });
    } catch (err) {
        console.error(err);
    }

    res.redirect(`${BASEPATH}/${req.params.id}`);
})


module.exports = router;
