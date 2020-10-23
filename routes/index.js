var express = require('express');
var router = express.Router();

const POOL = require('../database');
const { QUERY } = POOL;

/* GET home page. */
router.get('/', async function (req, res, next) {
  const { user } = req.session;
  if (!user) return res.redirect('/signin');
  const products = await QUERY`SELECT id, name, price::numeric, image, created_at FROM products ORDER BY updated_at DESC`;
  res.render('index', { username: `${user.full_name}`, products });
});

module.exports = router;
