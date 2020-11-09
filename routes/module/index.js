const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares');
const { SQL, QUERY1, ASSOCIATE } = require('../../database');
const renderMain = require('../../template/main');
const { Reviews } = require('../../associate');

router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    const {
      passport: { user: user_id },
    } = req.session;

    const products = await ASSOCIATE`
      products ${{ query: SQL`ORDER BY updated_at DESC` }}
        ${Reviews.ratings}`;

    console.log(products);

    const user = await QUERY1`SELECT id, full_name FROM users WHERE id = ${user_id}`;

    res.render('index', {
      title: 'Home',
      body: renderMain({ user, products }),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
