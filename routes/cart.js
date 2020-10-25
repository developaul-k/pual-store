const express = require('express');
const router = express.Router();

const { QUERY } = require('../database');
const { isLoggedIn } = require('../middlewares');

/* GET home page. */
router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    console.log(req.session.passport);
    const { user: id } = req.session.passport;

    const cart = await QUERY`
      SELECT c.amount, p.name, (p.price::numeric * c.amount) as price, p.image
      FROM cart c, products p
      WHERE c.user_id = ${id}
      AND p.id = c.product_id
    `;
    // res.header('Cache-Control', 'no-store');
    res.render('cart', { cart });
  } catch (err) {
    console.log(err);
    next();
  }
});

module.exports = router;
