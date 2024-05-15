const mongoose = require('mongoose');

async function getRaw(req, res, model) {
    // no validation because this is used for the login, before authentication exists
    try {
        const Model = require("../models/" + model);
        return await Model.find(null, null).lean();
    } catch (error) {
        console.error(error.message);
    }
}

async function getAll(req, res, model, limit = undefined, sortBy = "_id", sortDir = 1) {
    if (!req.session.read || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

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

async function update(req, res, model, id) {
    if (!req.session.update || !req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }

    try {
        console.log(req.body);
        const Model = require("../models/" + model);
        await Model.findByIdAndUpdate(id, req.body);
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
    getRaw,
    getAll,
    getOne,
    update,
    create,
    del
};

module.exports = crudController;
