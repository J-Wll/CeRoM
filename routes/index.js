var express = require('express');
var router = express.Router();
const crypto = require("node:crypto");

data = [{ name: crypto.randomUUID() }];

for (let i = 0; i < 10; i++) {
  data.push({ name: crypto.randomUUID() });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', data: data });
});

module.exports = router;