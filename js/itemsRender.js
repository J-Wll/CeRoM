const crudController = require('../controllers/crudController');

async function itemsRender(req, res, model, args, formatData = undefined) {
    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }

    const sortBy = req.query.sortBy || "_id";
    const sortDir = parseInt(req.query.sortDir) || 1;
    const limit = req.query.limit || 10;
    let extras = undefined;

    let items = await crudController.getAll(req, res, model, limit, sortBy, sortDir);

    if (items.length < 1) {
        // This is for when there is no data in the model, a table populated with just the headers and the ability to add an entry
        const Model = require(`../models/${model}`);
        let fields = Object.keys(Model.schema.paths);
        items = [{}]
        fields.forEach((f) => {
            items[0][f] = "";
            args.noItems = true;
        })
    } else if (formatData) {
        items = formatData(items, false);

    }

    res.render("items", {
        ...args,
        data: items,
        extras: extras,
        sortedBy: sortBy,
        sortedDir: sortDir,
        limited: limit,
        admin: req.session.admin,
        create: req.session.create
    })

}

module.exports = itemsRender;