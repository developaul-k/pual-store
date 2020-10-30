const express = require('express');
const router = express.Router();

const { go, map, strMap, split } = require('fxjs/Strict');
const { range: rangeL, map: mapL } = require('fxjs/Lazy');

const {
  QUERY,
  VALUES,
  SET,
  IN,
  TRANSACTION,
  FxSQL_DEBUG,
} = require('../database');

const { isLoggedIn } = require('../middlewares');

const renderCart = (cart) => {
  const isDisabled = cart.length ? '' : 'disabled';

  return `
    <table class="cart">
      <thead>
        <tr>
          <th class="left">
            <input type="checkbox" class="checkbox-all" checked ${isDisabled} />
          </th>
          <th></th>
          <th>상품명</th>
          <th>금액</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        ${strMap(
          ({ id, product_id, name, price, amount, image }) => `
            <tr data-id="${id}">
              <td>
                <input type="checkbox" class="checkbox" value="${product_id}" checked />
              </td>
              <td class="image">
                ${map((src) => `<img src="${src}" alt="${name}" />`, image)}
              </td>
              <td>${name}</td>
              <td class="right">${price}</td>
              <td class="center">
                <select>
                  ${go(
                    rangeL(1, amount + 1),
                    strMap(
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
    <button class="checkout" type="button" ${isDisabled}>주문하기</button>
    <script src="/javascripts/cart.js"></script>
  `;
};

const renderCheckout = ({ user, products }) => `
  <form class="checkout-form">
    <section>
      <h1>구매자정보</h1>
      <table>
        <tbody>
          <tr>
            <th scope="row">이름</th>
            <td>${user.full_name}</td>
          </tr>
          <tr>
            <th scope="row">이메일</th>
            <td>${user.email}</td>
          </tr>
          <tr>
            <th scope="row">연락처</th>
            <td>${user.phone}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h1>받는사람정보</h1>
      <table>
        <tbody>
          <tr>
            <th scope="row">이름</th>
            <td>${user.full_name}</td>
          </tr>
          <tr>
            <th scope="row">배송주소</th>
            <td>${user.address}</td>
          </tr>
          <tr>
            <th scope="row">연락처</th>
            <td>${user.phone}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
      <h1>구매목록</h1>
      <table class="cart">
        <thead>
          <tr>
            <th></th>
            <th>상품명</th>
            <th>금액</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          ${
            strMap(({ name, image }) => `
              <tr>
                <td class="image">
                  ${strMap(src => `<img src="${src}" alt="name" />`, image)}
                </td>
                <td>${name}</td>
              </tr>
            `, products)
          }
        </tbody>
      </table>
    </section>
  </form>
`;

router.get('/', isLoggedIn, async function (req, res, next) {
  const { user: user_id } = req.session.passport;

  /*   try {
    const test = await ASSOCIATE`
      users ${SQL`WHERE id = 4`}
        x products
    `;

    if (test) console.log('test', test[0]);
  } catch (err) {
    console.log(err);
  } */

  go(
    QUERY`
      SELECT c.id, p.id AS product_id, p.name, (p.price * c.amount) as price, c.amount, p.image
      FROM cart c, products p WHERE c.user_id = ${user_id} AND p.id = c.product_id ORDER BY created_at;
    `,
    (cart) => res.render('index', { title: 'Cart', body: renderCart(cart) })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

router.get('/checkout', isLoggedIn, async function (req, res, next) {
  const {
    query: { products },
    user,
  } = req;

  console.log(products);

  const cart_products = await QUERY`
    SELECT image, name FROM products WHERE ${IN('id', products)}
  `;

  console.log(cart_products);

  /* const cart_products = await QUERY`
    SELECT * FROM cart
    WHERE ${IN('product_id', products)}
    AND user_id = ${user.id}
  `; */

  res.render('index', {
    title: 'Checkout',
    body: renderCheckout({ user, products: cart_products }),
  });
});

router.post('/checkout/complete', isLoggedIn, async function (req, res, next) {
  const {
    session: {
      passport: { user: user_id },
    },
    query: { products },
  } = req;

  const { QUERY, COMMIT, ROLLBACK } = await TRANSACTION();

  try {
    FxSQL_DEBUG.LOG = true;
    const [order] = await QUERY`INSERT INTO orders ${VALUES({
      user_id,
    })} RETURNING id`;

    const _products = go(
      products,
      map((product_id) => ({ order_id: order.id, product_id }))
    );

    await QUERY`INSERT INTO products_orders ${VALUES(_products)}`;
    await COMMIT();
  } catch (err) {
    await ROLLBACK();
  }
});

router.post('/add', isLoggedIn, function (req, res, next) {
  const {
    session: {
      passport: { user: user_id },
    },
    body: { product_id },
  } = req;
  go(
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
