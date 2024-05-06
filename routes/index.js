var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.isAuthenticated) {
    if (req.session.flash) {
      res.locals.message = req.session.flash;
      delete req.session.flash;
    }
    res.render('dashboard');
  }
  else {
    req.session.flash = ({
      type: "error",
      message: "Login required"
    })
    res.locals.message = req.session.flash;
    res.redirect("/login");
  }
});

module.exports = router;