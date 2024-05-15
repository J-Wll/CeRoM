const express = require("express");
const router = express.Router();
const check = require("../middleware/check");

router.get("/", check.login, function (req, res) {
    res.render("changePassword");
});

// Runs login auth before the rest of the body
router.post("/submit", check.login, function (req, res, next) {
    console.log("done");
    console.log(req.session);
    if (req.session.isAuthenticated) {
        return res.redirect("/");
    }
});

module.exports = router;
