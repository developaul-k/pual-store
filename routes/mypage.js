const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares');
const { ASSOCIATE, SQL, COLUMN, FxSQL_DEBUG } = require('../database');
const { renderMain } = require('../template/mypage');

FxSQL_DEBUG.LOG=true;

router.get('/', isLoggedIn, async function (req, res, next) {
  const { user, user: { id: user_id } } = req;

  try {
    const orders = await ASSOCIATE`
      orders ${{
        column: COLUMN('id', SQL`to_char(orders.created_at, 'YYYY-MM-DD HH:MM') as order_date`),
        query: SQL`WHERE user_id = ${user_id}`,
      }}
        x products ${{
          column: COLUMN(SQL`products.*`, SQL`orders_products.quantity`)
        }}` || [];

    console.log(orders[1]._.products);

    res.render('index', {
      title: 'My page',
      body: renderMain({ user, orders }),
    });
  } catch(err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
