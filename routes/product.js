const express = require('express');
const router = express.Router();
const { go, strMap } = require('fxjs/Strict');
const { QUERY } = require('../database');
const { isLoggedIn } = require('../middlewares');

const renderCartButton = require('../component/cart-btn');

const renderProduct = ({ id, name, price, image }) => {
  return `
    <div class="column-box" data-id="${id}">
      <div class="column">
        ${strMap((src) => `<img src="${src}" alt="${name}"/>`, image)}
      </div>
      <div class="column">
        <div style="font-size: 24px; font-weight: bold">${name}</div>
        <div>Price: ${price}</div>
        ${renderCartButton()}
      </div>
    </div>
  `;
};

router.get('/:id', isLoggedIn, async function (req, res, next) {
  const {
    params: { id: product_id },
  } = req;

  go(QUERY`SELECT * FROM products WHERE id =${product_id}`, ([product]) =>
    res.render('index', { title: `${product.name} | detail`, body: renderProduct(product) })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

module.exports = router;
