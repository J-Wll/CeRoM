var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // if auth cookie render dashboard, otherwise, render login
  // if (auth) { 

  // }
  res.render('index', { title: 'CeRoM' });
});

module.exports = router;