const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares');
const { QUERY } = require('../database');

router.get('/', async function (req, res, next) {
  // const {
  //   passport: { user: user_id },
  // } = req.session;

  // const products = await QUERY`
  //   SELECT id, name, price::numeric, image, created_at
  //   FROM products ORDER BY updated_at DESC
  // `;

  // const [user] = await QUERY`SELECT full_name FROM users WHERE id = ${user_id}`;

  // res.render('index', { username: user.full_name, products, user_id });

  res.render('index', { body: `<div>akdsflkj</div>` });
});

module.exports = router;
