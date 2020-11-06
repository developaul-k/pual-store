const express = require('express');
const router = express.Router();
const { ASSOCIATE1, SQL, FxSQL_DEBUG } = require('../../database');
const { isLoggedIn } = require('../../middlewares');
const { renderProduct } = require('../../template/product');

router.get('/:id', isLoggedIn, async function (req, res, next) {
  const {
    params: { id: product_id },
  } = req;

  FxSQL_DEBUG.LOG = true;
  try {
    const product = await ASSOCIATE1`
      products ${{ query: SQL`WHERE id = ${product_id}` }}
        < reviews
          - grades
      `;

    res.render('index', {
      title: `${product.name}`,
      body: renderProduct(product)
    });
  } catch(err) {
    console.log(err);
    next();
  }
});

module.exports = router;
