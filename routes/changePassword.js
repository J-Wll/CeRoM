const express = require("express");
const router = express.Router();
const check = require("../middleware/check");
const hashPassword = require('../js/hashPassword');
const crudController = require("../controllers/crudController");
const bcrypt = require("bcrypt");
const flashError = require("../js/flashError");

router.get("/", check.login, function (req, res) {
    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }
    res.render("changePassword");
});

// Runs login auth before the rest of the body
router.post("/submit", check.login, async function (req, res, next) {
    console.log(req.body);
    console.log(req.session.id)
    const userData = await crudController.getOne(req, res, "employee", req.session.userID);
    const pass = userData.password;
    let userPassMatch = false;

    if (req.body.newPassword.length < 8) {
        return flashError(req, res, "New password not long enough (needs to be >= 8)", "/change-password");
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return flashError(req, res, "Passwords do not match", "/change-password");
    }

    bcrypt.compare(req.body.currentPassword, pass, function (err, result) {
        userPassMatch = result === true;

        if (!userPassMatch) {
            return flashError(req, res, "Current pass is wrong", "/change-password");
        }

    })

    req.body.password = await hashPassword(req.body.newPassword);

    crudController.update(req, res, "employee", req.session.userID)

    req.session.flash = {
        type: "message",
        message: "Password changed",
    };

    res.redirect("/change-password")

});

module.exports = router;
