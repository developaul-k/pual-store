const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares');
const { ASSOCIATE, SQL, COLUMN } = require('../database');
const { renderMain } = require('../template/mypage');

router.get('/', isLoggedIn, async function (req, res, next) {
  const { user, user: { id: user_id } } = req;

  try {
    const orders = await ASSOCIATE`
      orders ${{
        column: COLUMN('id', SQL`to_char(orders.created_at, 'YYYY-MM-DD HH:MM') as created_at`),
        query: SQL`WHERE user_id = ${user_id}`,
      }}
        x products`;

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
