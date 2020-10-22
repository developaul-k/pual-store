var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.session.user) return res.redirect('/');
  console.log('signin: ', req.session.user);
  res.render('signin');
});

module.exports = router;
