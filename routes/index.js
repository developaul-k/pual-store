var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET home page. */
router.get('/', function (req, res, next) {
  const { user } = req.session;

  if (!user) return res.redirect('/signin');
  res.render('index', { username: `${user.full_name}` });
});

module.exports = router;
