const mongoose = require('mongoose');
const flashError = require("../js/flashError");

// raw ones do not have extra validation because used for login, pass changing etc. (a user without update perm should be able to change their own pass)
async function getRaw(req, res, model, fields = null) {
    try {
        const Model = require("../models/" + model);
        return await Model.find(null, fields).lean();
    } catch (error) {
        console.error(error.message);
    }
}

// raw ones do not have extra validation because used for login, pass changing etc. (a user without update perm should be able to change their own pass)
async function getOneRaw(req, res, model, id, fields = null) {
    try {
        const Model = require("../models/" + model);
        const item = await Model.findById(id, fields).lean();
        return item;
    } catch (error) {
        console.error(error.message);
    }
}

async function updateRaw(req, res, model, id) {
    try {
        const Model = require("../models/" + model);
        await Model.findByIdAndUpdate(id, req.body);
    } catch (error) {
        console.error(error.message);
    }
}

async function createRaw(req, res, model) {
    try {
        const Model = require("../models/" + model);
        const newItem = await new Model(req.body);
        await newItem.save();
    } catch (error) {
        console.error(error);
    }
}

// the permissions checks are also done in the routes before crudController is called, these are redundancies
async function getAll(req, res, model, limit = undefined, sortBy = "_id", sortDir = 1, fields = null) {
    if (!req.session.read || !req.session.isAuthenticated) {
        return flashError(req, res, "Not signed in or invalid permissions", "/");
    }

    try {
        const Model = require("../models/" + model);
        // collation is for sorting case insensitive, lean is to remove non-needed fields (was causing an issue on the table)
        const items = await Model.find(null, fields, { limit: limit, sort: { [sortBy]: sortDir }, collation: { locale: 'en' } }).lean();
        return items;
    } catch (error) {
        console.error(error.message);
    }
}

async function getOne(req, res, model, id, fields = null) {
    if (!req.session.read || !req.session.isAuthenticated) {
        return flashError(req, res, "Not signed in or invalid permissions", "/");
    }

    try {
        const Model = require("../models/" + model);
        const item = await Model.findById(id, fields).lean();
        return item;
    } catch (error) {
        console.error(error.message);
    }
}

async function update(req, res, model, id) {
    if (!req.session.update || !req.session.isAuthenticated) {
        return flashError(req, res, "Not signed in or invalid permissions", "/");
    }

    try {
        const Model = require("../models/" + model);
        await Model.findByIdAndUpdate(id, req.body);
    } catch (error) {
        console.error(error.message);
    }

}

async function create(req, res, next, modelName, returnTo = undefined) {
    if (!req.session.create || !req.session.isAuthenticated) {
        return flashError(req, res, "Not signed in or invalid permissions", "/");
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
        return flashError(req, res, "Not signed in or invalid permissions", "/");
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
    getOneRaw,
    updateRaw,
    createRaw,
    getAll,
    getOne,
    update,
    create,
    del
};

module.exports = crudController;
