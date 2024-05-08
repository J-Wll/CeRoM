const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const crudController = require('../controllers/crudController');

router.post('/create/:model', checkAuth, crudController.create, (req, res) => {
    res.redirect();
});

module.exports = router;
