const mongoose = require('mongoose');

async function getAll(req, res, model, limit = undefined, sortBy = "_id", sortDir = 1) {
    // if (!req.session.read || !req.session.isAuthenticated) {

    // }
    const modelName = model;
    try {
        const Model = require("../models/" + modelName);
        // collation is for sorting case insensitive, lean is to remove non-needed fields (was causing an issue on the table)
        const items = await Model.find(null, null, { limit: limit, sort: { [sortBy]: sortDir }, collation: { locale: 'en' } }).lean();
        return items;
    } catch (error) {
        console.error(error.message);
    }
}

async function getOne(req, res, model, id) {
    // if (!req.session.read || !req.session.isAuthenticated) {

    // }
    const modelName = model;
    try {
        const Model = require("../models/" + modelName);
        const item = await Model.findById(id).lean();
        return item;
    } catch (error) {
        console.error(error.message);
    }
}

async function create(req, res, next, modelName, returnTo = undefined) {
    // Add crud perm check and admin check for employees
    // if (!req.session.create || !req.session.isAuthenticated) {
    //     res.json({ message: "Not signed in or invalid permissions" });
    //     return;
    // }
    // const modelName = req.params.model;
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

const crudController = {
    getAll,
    getOne,
    create
};

module.exports = crudController;
