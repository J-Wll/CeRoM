const mongoose = require('mongoose');

exports.getAll = async (req, res, model, limit, sortBy, sortDir) => {
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
};


exports.create = async (req, res, next) => {
    // Add crud perm check and admin check for employees
    // if (!req.session.create || !req.session.isAuthenticated) {
    //     res.json({ message: "Not signed in or invalid permissions" });
    //     return;
    // }
    const modelName = req.params.model;
    try {
        const Model = require("../models/" + modelName);
        const newItem = await new Model(req.body);
        await newItem.save();
        res.redirect(req.get("referer"))
    } catch (error) {
        console.error(error.message);
    }
};

