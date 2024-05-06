var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.isAuthenticated) {
    req.session.flash = ({
      type: "error",
      message: "Login required"
    })
    res.redirect("/login");
  }

  if (req.session.flash) {
    res.locals.message = req.session.flash;
    delete req.session.flash;
  }

  let perms = [];
  if (req.session.admin) { perms.push("Admin") };
  if (req.session.create) { perms.push("Create") };
  if (req.session.read) { perms.push("Read") };
  if (req.session.update) { perms.push("Update") };
  if (req.session.delete) { perms.push("Delete") };

  res.render('dashboard', { username: req.session.username, perms });


});

module.exports = router;