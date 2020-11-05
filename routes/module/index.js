const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares');
const { QUERY, QUERY1 } = require('../../database');
const renderMain = require('../../template/main');

router.get('/', isLoggedIn, async function (req, res, next) {
  const {
    passport: { user: user_id },
  } = req.session;

  const products = await QUERY`
    SELECT id, name, price::numeric, image, created_at
    FROM products ORDER BY updated_at DESC
  `;

  const user = await QUERY1`SELECT id, full_name FROM users WHERE id = ${user_id}`;

  res.render('index', { title: 'Home | pual store', body: renderMain({ user, products }) });
});

module.exports = router;
