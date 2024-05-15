const mongoose = require('mongoose');

async function getAll(req, res, model, limit = undefined, sortBy = "_id", sortDir = 1, login = false) {
    // if (!login && (!req.session.read || !req.session.isAuthenticated)) {
    //     res.json({ message: "Not signed in or invalid permissions" });
    //     return;
    // }

    try {
        const Model = require("../models/" + model);
        // collation is for sorting case insensitive, lean is to remove non-needed fields (was causing an issue on the table)
        const items = await Model.find(null, null, { limit: limit, sort: { [sortBy]: sortDir }, collation: { locale: 'en' } }).lean();
        return items;
    } catch (error) {
        console.error(error.message);
    }
}

async function getOne(req, res, model, id) {
    if (!req.session.read || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

    try {
        const Model = require("../models/" + model);
        const item = await Model.findById(id).lean();
        return item;
    } catch (error) {
        console.error(error.message);
    }
}

async function update(req, res, model) {
    if (!req.session.update || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

    try {
        const Model = require("../models/" + model);
        await Model.findByIdAndUpdate(req.params.id, req.body);
    } catch (error) {
        console.error(error.message);
    }

}

async function create(req, res, next, modelName, returnTo = undefined) {
    if (!req.session.create || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

    try {
        const Model = require("../models/" + modelName);
        const newItem = await new Model(req.body);
        await newItem.save();
        if (returnTo) {
            return res.redirect(returnTo);
        } else {
            return res.json({ added: newItem });
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function del(req, res, model) {
    if (!req.session.delete || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

    try {
        const Model = require("../models/" + model);
        await Model.findByIdAndDelete(req.params.id);
    } catch (error) {
        console.error(error.message);
    }
}

const crudController = {
    getAll,
    getOne,
    update,
    create,
    del
};

module.exports = crudController;
