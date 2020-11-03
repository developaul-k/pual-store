const express = require('express');
const router = express.Router();
const { go, map, reduce, add, split, find } = require('fxjs/Strict');
const { QUERY, QUERY1, VALUES, SET, IN, TRANSACTION } = require('../database');
const { isLoggedIn } = require('../middlewares');

const { renderMain, renderCheckout } = require('../template/cart');

router.get('/', isLoggedIn, async function (req, res, next) {
  const {
    user: { id: user_id },
  } = req;

  go(
    QUERY`SELECT c.id, p.id AS product_id, p.name, (p.price * c.amount) as price, c.amount, p.image
      FROM cart c, products p WHERE c.user_id = ${user_id} AND p.id = c.product_id ORDER BY created_at;`,
    (cart) =>
      res.render('index', {
        title: 'Cart',
        body: renderMain(cart),
        pageScript: ['cart.js'],
      })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

router.get('/checkout', isLoggedIn, async function (req, res, next) {
  const {
    user,
    query: { products },
  } = req;

  const _products = map(
    split(':'),
    typeof products == 'string' ? [products] : products
  );

  const product_ids = map(([id, _]) => id, _products);

  go(
    QUERY`SELECT id, image, price, name FROM products WHERE ${IN(
      'id',
      product_ids
    )}`,
    map((product) =>
      go(
        _products,
        find(([id, _]) => product.id == id),
        ([_, amount]) => ({ ...product, amount })
      )
    ),
    (products) => {
      const total_prices = reduce(
        add,
        map(({ price, amount }) => price * amount, products)
      );
      const shipping_cost = total_prices > 100000 ? 0 : 3000;

      res.render('index', {
        title: 'Checkout',
        body: renderCheckout({ user, products, total_prices, shipping_cost }),
      });
    }
  ).catch((err) => {
    console.log(err);
    next(err);
  });
});

router.post('/checkout/complete', isLoggedIn, async function (req, res, next) {
  const {
    user: { id: user_id },
    query: { products },
  } = req;

  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();

  try {
    const order = await QUERY1`INSERT INTO orders ${VALUES({
      user_id,
    })} RETURNING id`;

    const orders_products = map(
      (product_id) => ({ order_id: order.id, product_id }),
      products
    );

    await QUERY`INSERT INTO orders_products ${VALUES(orders_products)}`;
    await COMMIT();
  } catch (err) {
    await ROLLBACK();
  }
});

router.post('/add', isLoggedIn, async function (req, res, next) {
  try {
    const {
      user: { id: user_id },
      body: { product_id },
    } = req;

    (await QUERY1`
      UPDATE cart
      SET amount = amount + 1
      WHERE product_id = ${product_id} AND user_id = ${user_id}
      RETURNING id
    `) ||
      (await QUERY1`INSERT INTO cart ${VALUES({
        ...req.body,
        user_id,
        amount: 1,
      })}`);

    res.send({ data: 'ok' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put('/update', isLoggedIn, async function (req, res, next) {
  const {
    body: { id, amount },
  } = req;

  try {
    await QUERY`UPDATE cart ${SET({ amount })} WHERE id = ${id}`;
    res.send({ redirectTo: '/cart' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete('/delete', isLoggedIn, async function (req, res, next) {
  const {
    body: { cart_ids },
  } = req;

  try {
    await QUERY`DELETE FROM cart WHERE ${IN('id', cart_ids)}`;
    res.send({ redirectTo: '/cart' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
