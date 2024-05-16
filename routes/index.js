const express = require('express');
const router = express.Router();
const permsArr = require("../js/permsArr");

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.isAuthenticated) {
    req.session.flash = ({
      type: "error",
      message: "Login required"
    })
    return res.redirect("/login");
  }

  if (req.session.flash) {
    res.locals.message = req.session.flash;
    delete req.session.flash;
  }

  const perms = permsArr(req);

  res.render('dashboard', { username: req.session.username, admin: req.session.admin, perms });
});

router.get('/sign-out', function (req, res, next) {
  req.session.destroy(res.redirect("/login"))
})


module.exports = router;