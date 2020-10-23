var express = require('express');
var router = express.Router();

const { QUERY } = require('../database');
<<<<<<< HEAD
const { isLoggedIn } = require('../middlewares');

/* GET home page. */
router.get('/', isLoggedIn, async function (req, res, next) {
=======

/* GET home page. */
router.get('/', async function (req, res, next) {
>>>>>>> d35cbee... updated products
  const { user } = req.session;
  if (!user) return res.redirect('/signin');

  try {
    const {
      user: { id },
    } = req.session;

    const cart = await QUERY`
      SELECT c.amount, p.name, (p.price::numeric * c.amount) as price, p.image
      FROM cart c, products p
      WHERE c.user_id = ${id}
      AND p.id = c.product_id
    `;
    res.header('Cache-Control', 'no-store');
    res.render('cart', { cart });
  } catch (err) {
    console.log(err);
    next();
  }
});

module.exports = router;
