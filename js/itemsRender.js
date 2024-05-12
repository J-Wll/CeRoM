const crudController = require('../controllers/crudController');

async function itemsRender(req, res, model, args) {

    const sortBy = req.query.sortBy || "_id";
    const sortDir = parseInt(req.query.sortDir) || 1;
    const limit = req.query.limit || 10;

    let items = await crudController.getAll(req, res, model, limit, sortBy, sortDir);

    if (items.length < 1) {
        // This is for when there is no data in the model, a table populated with just the headers and the ability to add an entry
        const Model = require(`../models/${model}`);
        let fields = Object.keys(Model.schema.paths);
        items = [{}]
        fields.forEach((f) => {
            items[0][f] = "";
        })
    }

    console.log(items);

    res.render("items", {
        ...args,
        data: items,
        sortedBy: sortBy,
        sortedDir: sortDir,
        limited: limit,
    })

}

module.exports = itemsRender;