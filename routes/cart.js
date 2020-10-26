const express = require('express');
const router = express.Router();

const { QUERY, VALUES } = require('../database');
const { isLoggedIn } = require('../middlewares');
const layout = require('../views/layout');
const cart = require('../views/cart');

/* GET home page. */
router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    const { user: id } = req.session.passport;

    const cartItem = await QUERY`
      SELECT DISTINCT p.id, p.name, p.price, sum(c.amount) as amounts, p.image
      FROM cart c, products p WHERE c.user_id = ${id} AND p.id = c.product_id GROUP BY p.id;
    `;

    res.send(layout('cart', cart({ cart: cartItem })));
  } catch (err) {
    console.log(err);
    next();
  }
});

router.post('/add', isLoggedIn, async function (req, res, next) {
  try {
    await QUERY`INSERT INTO cart ${VALUES(req.body)}`;
    res.send({ data: 'ok' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
