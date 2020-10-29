const express = require('express');
const router = express.Router();
const _ = require('fxjs/Strict');

const { isLoggedIn } = require('../middlewares');
const { QUERY } = require('../database');
const renderCartButton = require('../component/cart-btn');

router.get('/', isLoggedIn, async function (req, res, next) {
  const {
    passport: { user: user_id },
  } = req.session;

  const products = await QUERY`
    SELECT id, name, price::numeric, image, created_at
    FROM products ORDER BY updated_at DESC
  `;

  const [
    user,
  ] = await QUERY`SELECT id, full_name FROM users WHERE id = ${user_id}`;

  const renderHome = ({ user, products }) => `
    <div>
      <h1>안녕하세요! ${user.full_name} 님</h1>
      <a href="/cart">장바구니</a>
      <a href="/auth/signout">로그아웃</a>

      <h2 class="h2">신제품</h2>
      <ul class="product-list">
        ${
          products.length
            ? _.strMap(
                ({ id, image, name, price }) => `
                <li class="product-item" data-id="${id}">
                  <a href="/product/${id}">
                    <div class="product-image">
                      <img src="${image}" alt="">
                    </div>
                    <div class="product-name">${name}</div>
                    <div class="product-price">${price}</div>
                  </a>
                  ${renderCartButton()}
                </li>
                `,
                products
              )
            : `<div>제품이 없습니다.</div>`
        }
      </ul>
    </div>
  `;

  res.render('index', { title: 'Home', body: renderHome({ user, products }) });
});

module.exports = router;
