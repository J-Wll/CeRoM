const crudController = require('../controllers/crudController');

async function singleItemRender(req, res, model, id, args, formatData = undefined, fields = undefined) {
    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }

    let item = await crudController.getOne(req, res, model, id, fields);
    let extras = undefined;

    if (!item) {
        return res.json({ error: "Item does not exist" })
    }

    if (formatData) {
        item = formatData(item);
        if (item.extras) {
            extras = item.extras;
            delete item.extras;
        }
    }

    console.log(item);

    res.render("singleItem", {
        ...args,
        data: item,
        extras: extras,
        admin: req.session.admin,
        rootAdmin: req.session.rootAdmin
    })

}

module.exports = singleItemRender;