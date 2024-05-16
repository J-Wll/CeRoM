const crudController = require('../controllers/crudController');

async function singleItemRender(req, res, model, id, args, formatData = undefined) {
    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }

    let item = await crudController.getOne(req, res, model, id);
    let extras = undefined;

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
        admin: req.session.admin
    })

}

module.exports = singleItemRender;