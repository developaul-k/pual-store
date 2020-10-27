const express = require('express');
const router = express.Router();

const _ = require('fxjs/Strict');

const { QUERY, VALUES, ASSOCIATE, SQL } = require('../database');

const { isLoggedIn } = require('../middlewares');

const renderCart = (cart) => {
  return `
    <a href="javascript:history.back()">뒤로가기</a>
    <table class="cart">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>상품명</th>
          <th>금액</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        ${_.strMap(
          ({ id, name, price, amounts, image }) => `
            <tr data-id="${id}">
              <td>
                <input type="checkbox" />
              </td>
              <td class="image">
                ${_.map((src) => `<img src="${src}" alt="${name}" />`, image)}
              </td>
              <td>${name}</td>
              <td class="right">${price}</td>
              <td class="center">${amounts}</td>
            </tr>
          `,
          cart
        )}
      </tbody>
    </table>
  `;
};

router.get('/', isLoggedIn, async function (req, res, next) {
  const { user: user_id } = req.session.passport;

  try {
    const test = await ASSOCIATE`
      users ${SQL `WHERE id = 5`}
        x products ${{ xtable: 'cart' }}
    `;

    console.log('test', test[0]._.products)
  } catch(err) {
    console.log(err);
  }

  _.go(
    QUERY`
        SELECT DISTINCT p.id, p.name, sum(p.price) as price, sum(c.amount) as amounts, p.image
        FROM cart c, products p WHERE c.user_id = ${user_id} AND p.id = c.product_id GROUP BY p.id;
      `,
    renderCart,
    (body) => res.render('index', { title: '장바구니', body })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

router.post('/add', isLoggedIn, function (req, res, next) {
  _.go(
    QUERY`INSERT INTO cart ${VALUES(req.body)}`,
    (_) => res.send({ data: 'ok' })
  ).catch((err) => {
    console.log(err);
    next(err);
  });
});

module.exports = router;
