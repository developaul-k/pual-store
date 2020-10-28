const express = require('express');
const router = express.Router();

const _ = require('fxjs/Strict');
const rangeL = require('fxjs/Lazy/rangeL');

const { QUERY, VALUES, ASSOCIATE, SQL, SET, IN } = require('../database');

const { isLoggedIn } = require('../middlewares');

const renderCart = (cart) => {
  const isDisabled = cart.length ? '' : 'disabled';

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
          ({ id, name, price, amount, image }) => `
            <tr data-id="${id}">
              <td>
                <input type="checkbox" checked />
              </td>
              <td class="image">
                ${_.map((src) => `<img src="${src}" alt="${name}" />`, image)}
              </td>
              <td>${name}</td>
              <td class="right">${price}</td>
              <td class="center">
                <select>
                  ${_.go(
                    rangeL(1, amount + 1),
                    _.strMap(
                      (n) =>
                        `<option value="${n}" ${
                          amount == n ? 'selected' : ''
                        }>${n}</option>`
                    )
                  )}
                </select>
              </td>
            </tr>
          `,
          cart
        )}
      </tbody>
    </table>
    <button class="delete-cart" type="button" ${isDisabled}>선택 상품 삭제</button>
    <button class="delete-cart" data-type="all" type="button" ${isDisabled}>전체 상품 삭제</button>
    <script>
      _.go(
        $.qsa('[type="checkbox"]'),
        $.on('change', ({ currentTarget }) => {
          if ($.qsa('[type="checkbox"]:checked').length > 0) {
            $.qs('.delete-cart').removeAttribute('disabled');
          } else {
            $.qs('.delete-cart').setAttribute('disabled', true);
          }}));

      _.go(
        $.qsa('.delete-cart'),
        $.on('click', ({ currentTarget }) => {
          const typeAll = currentTarget.getAttribute('data-type') == 'all';
          const sel = typeAll ? '[type="checkbox"]' : '[type="checkbox"]:checked';
          const message = typeAll ? '전체 상품을 삭제하시겠습니까?' : '선택한 상품을 삭제하시겠습니까?'

          if (confirm(message)) {
            const body = _.go(
              $.qsa(sel),
              _.map(el => $.data($.closest('tr', el)).id),
              cart_ids => JSON.stringify({ cart_ids }));

            _.go(
              loadingCtrl(),
              _ => fetch('/cart/delete', {
                headers: {
                  "Content-Type": "application/json"
                },
                method: "DELETE",
                body
              }),
              res => res.json(),
              ({redirectTo}) => location.replace(redirectTo)
            ).catch(err => {
              loadingCtrl('close');
              console.log(err);
            })}}));
      _.go(
        $.qsa('select'),
        $.on('change', ({ currentTarget }) => _.go(
          currentTarget,
          $.find('option:checked'),
          ({ value: amount }) => {
            loadingCtrl();
            const { id } = $.data($.closest('tr', currentTarget));

            fetch('/cart/update', {
              headers: {
                "Content-Type": "application/json"
              },
              method: "PUT",
              body: JSON.stringify({ id, amount })
            })
            .then(res => res.json())
            .then(({redirectTo}) => location.replace(redirectTo))
            .catch(err => console.log(err));
          }
        )));
    </script>
  `;
};

router.get('/', isLoggedIn, async function (req, res, next) {
  const { user: user_id } = req.session.passport;

  try {
    const test = await ASSOCIATE`
      users ${SQL`WHERE id = 4`}
        x products ${{ xtable: 'cart' }}
    `;

    if (test) console.log('test', test[0]);
  } catch (err) {
    console.log(err);
  }

  _.go(
    QUERY`
      SELECT c.id, p.name, (p.price * c.amount) as price, c.amount, p.image
      FROM cart c, products p WHERE c.user_id = ${user_id} AND p.id = c.product_id ORDER BY created_at;
    `,
    (cart) => res.render('index', { title: '장바구니', body: renderCart(cart) })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

router.post('/add', isLoggedIn, function (req, res, next) {
  const {
    session: {
      passport: { user: user_id },
    },
    body: { product_id },
  } = req;
  _.go(
    QUERY`
      SELECT id, amount
      FROM cart
      WHERE user_id = ${user_id} AND product_id = ${product_id};
    `,
    ([existCart]) => {
      if (existCart) {
        const { id, amount } = existCart;

        return QUERY`
          UPDATE cart
          ${SET({ amount: amount + 1 })}
          WHERE id = ${id} AND product_id = ${product_id}
        `;
      }
      QUERY`INSERT INTO cart ${VALUES({ ...req.body, user_id, amount: 1 })}`;
    },
    (_) => res.send({ data: 'ok' })
  ).catch((err) => {
    console.log(err);
    next(err);
  });
});

router.put('/update', isLoggedIn, async function (req, res, next) {
  const {
    body: { id, amount },
  } = req;

  await QUERY`
    UPDATE cart ${SET({ amount })}
    WHERE id = ${id}`;

  res.send({ redirectTo: '/cart' });
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
