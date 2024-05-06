const mongoose = require('mongoose');


exports.create = async (req, res) => {
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
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

