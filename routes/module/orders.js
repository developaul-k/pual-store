const express = require('express');
const { map, reduce, add } = require('fxjs/Strict');
const router = express.Router();
const { ASSOCIATE1, SQL, COLUMN } = require('../../database');
const { isLoggedIn } = require('../../middlewares');
const { renderMain } = require('../../template/orders');

router.get('/:order_id', isLoggedIn, async function (req, res, next) {
  const {
    params: { order_id },
  } = req;

  try {
    const orders = await ASSOCIATE1`
      orders ${{
        column: COLUMN('id', SQL`to_char(orders.created_at, 'YYYY-MM-DD HH:MM') as order_date`),
        query: SQL`WHERE orders.id = ${order_id} ORDER BY created_at DESC`,
      }}
        x products ${{
          column: COLUMN(SQL`products.*`, SQL`orders_products.quantity`)
        }}` || [];

    const total_prices = reduce(add, map(({ price, quantity }) => price * quantity, orders._.products));
    const shipping_cost = total_prices > 100000 ? 0 : 3000;

    res.render('index', { title: '주문상세', body: renderMain({ orders, total_prices, shipping_cost}) });
  } catch(err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
