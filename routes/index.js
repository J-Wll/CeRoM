var express = require('express');
var router = express.Router();
const crypto = require("node:crypto");

data = [{ id: crypto.randomUUID(), name: "default", price: (Math.random() * 100).toFixed(2) }];

for (let i = 0; i < 10; i++) {
  data.push({ id: crypto.randomUUID(), name: "default", price: (Math.random() * 100).toFixed(2) });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', data: data });
});

module.exports = router;