const express = require('express');
const router = express.Router();
const go = require('fxjs/Strict/go');
const { productDetail } = require('../../components/products');
const { QUERY } = require('../../database');
const { isLoggedIn } = require('../../middlewares');

router.get('/:id', isLoggedIn, async function (req, res, next) {
  const {
    params: { id: product_id },
  } = req;

  go(QUERY`SELECT * FROM products WHERE id =${product_id}`, ([product]) =>
    res.render('index', { title: `${product.name}  | pual store`, body: `<div class="contents">${productDetail(product)}</div>` })
  ).catch((err) => {
    console.log(err);
    next();
  });
});

module.exports = router;
