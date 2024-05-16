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
    res.render("changePassword", { admin: req.session.admin });
});

// Runs login auth before the rest of the body
router.post("/submit", check.login, async function (req, res, next) {
    const userData = await crudController.getOneRaw(req, res, "employee", req.session.userID, "password");
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

    const newPass = await hashPassword(req.body.newPassword);
    req.body = {}
    req.body.password = newPass;

    crudController.updateRaw(req, res, "employee", req.session.userID)

    req.session.flash = {
        type: "message",
        message: "Password changed",
    };

    return res.redirect("/change-password")

});

module.exports = router;
