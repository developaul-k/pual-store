const express = require('express');
const POOL = require('../database');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();
const { QUERY } = POOL;

/* GET home page. */
router.get('/', isLoggedIn, async function (req, res, next) {
  //  const products = await QUERY`SELECT id, name, price::numeric, image, created_at FROM products ORDER BY updated_at DESC`;
  // res.render('index', { username: `${user.full_name}`, products });
  res.render('index');
});

module.exports = router;
