const mongoose = require('mongoose');

exports.getAll = async (req, model) => {
    const modelName = model;
    try {
        const Model = require("../models/" + modelName);
        const items = await Model.find().lean();
        console.log(items);
        return items;
    } catch (error) {
        console.error(error.message);
    }
};


exports.create = async (req, res, next) => {
    // Add crud perm check and admin check for employees
    if (!req.session.isAuthenticated) {
        res.json({ message: "Not signed in or invalid permissions" });
        return;
    }
    const modelName = req.params.model;
    console.log(modelName);
    try {
        const Model = require("../models/" + modelName);
        const newItem = await new Model(req.body);
        await newItem.save();
        // redirects to whatever url the request came from so that the change can be seen right away
        res.redirect(req.get("referer"))
    } catch (error) {
        // res.status(400).json({ message: error.message });
        console.error(error.message);
    }
};

