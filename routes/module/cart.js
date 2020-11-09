const express = require('express');
const router = express.Router();
const { go, map, reduce, add, split, find } = require('fxjs/Strict');
const {
  QUERY,
  QUERY1,
  VALUES,
  SET,
  IN,
  TRANSACTION,
} = require('../../database');
const { isLoggedIn } = require('../../middlewares');

const { renderMain, renderCheckout } = require('../../template/cart');

router.get('/', isLoggedIn, function (req, res, next) {
  const {
    user: { id: user_id },
  } = req;

  go(
    QUERY`SELECT c.id, p.id AS product_id, p.name, (p.price * c.amount) as price, c.amount, p.image
      FROM cart c, products p WHERE c.user_id = ${user_id} AND p.id = c.product_id ORDER BY created_at;`,
    (cart) =>
      res.render('index', {
        title: '장바구니',
        body: renderMain(cart),
        pageScript: ['cart.js'],
      })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  const {
    user,
    query: { products },
  } = req;

  if (!products) res.redirect('/cart');

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
        title: '주문 결제',
        body: renderCheckout({ user, products, total_prices, shipping_cost }),
        pageScript: ['checkout.js'],
      });
    }
  ).catch((err) => {
    console.log(err);
    next(err);
  });
});

router.get('/order-placed', isLoggedIn, async function (req, res, next) {
  const {
    user: { id: user_id },
  } = req;

  res.render('index', {
    title: '주문완료',
    body: `
      <div>
        <div class="h1">주문완료</div>
        <a href="/">홈으로</a>
      </div>
    `,
  });
});

router.post('/order-placed', isLoggedIn, async function (req, res, next) {
  const {
    user: { id: user_id },
    body: { products },
  } = req;

  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();

  try {
    const order = await QUERY1`INSERT INTO orders ${VALUES({
      user_id,
    })} RETURNING id`;

    const orders_products = map(
      ([product_id, quantity]) => ({
        order_id: order.id,
        product_id,
        quantity,
      }),
      products
    );

    await QUERY`INSERT INTO orders_products ${VALUES(orders_products)}`;
    await QUERY`DELETE FROM cart WHERE user_id = ${user_id}`;
    await COMMIT();

    res.send({ redirectTo: '/cart/order-placed' });
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
  try {
    const {
      body: { id, amount },
    } = req;

    await QUERY`UPDATE cart ${SET({ amount })} WHERE id = ${id}`;
    res.send({ redirectTo: '/cart' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete('/delete', isLoggedIn, async function (req, res, next) {
  try {
    const {
      body: { cart_ids },
    } = req;

    await QUERY`DELETE FROM cart WHERE ${IN('id', cart_ids)}`;
    res.send({ redirectTo: '/cart' });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
