const express = require("express");
const router = express.Router();
const loginAuth = require("../middleware/loginAuth");

router.get("/", function (req, res) {
    if (req.session.isAuthenticated) {
        req.session.flash = {
            type: "error",
            message: "Already logged in",
        };
        return res.redirect("/");
    }

    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }
    res.render("login");
});

// Runs login auth before the rest of the body
router.post("/submit", loginAuth, function (req, res, next) {
    if (req.session.isAuthenticated) {
        return res.redirect("/");
    }
});

module.exports = router;
