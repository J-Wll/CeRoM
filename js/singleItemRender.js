const crudController = require('../controllers/crudController');

async function singleItemRender(req, res, model, id, args, formatData = undefined) {
    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }

    let item = await crudController.getOne(req, res, model, id);

    if (formatData) {
        item = formatData(item);
    }

    console.log(item);

    res.render("singleItem", {
        ...args,
        data: item,
        admin: req.session.admin
    })

}

module.exports = singleItemRender;