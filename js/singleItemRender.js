const crudController = require('../controllers/crudController');

async function singleItemRender(req, res, model, id, args) {

    let item = await crudController.getOne(req, res, model, id);

    console.log(item);

    res.render("singleItem", {
        ...args,
        data: item,
        admin: req.session.admin
    })

}

module.exports = singleItemRender;