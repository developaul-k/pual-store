const express = require('express');
const router = express.Router();
const { ASSOCIATE1, SQL, COLUMN } = require('../../database');
const { isLoggedIn } = require('../../middlewares');
const { renderProduct } = require('../../template/product');
const { go, join, split } = require('fxjs/Strict');
const { map: mapL, range: rangeL } = require('fxjs/Lazy');
const { Reviews } = require('../../associate');

router.get('/:id', isLoggedIn, async function (req, res, next) {
  try {
    const {
      params: { id: product_id },
    } = req;

    const product = await ASSOCIATE1`
      products ${{ query: SQL`WHERE id = ${product_id}` }}
        < reviews ${{
          column: COLUMN(
            'text',
            SQL`to_char(reviews.updated_at, 'YYYY-MM-DD') AS updated_at`
          ),
        }}
          - users ${{
            column: COLUMN('full_name'),
            hook: ({ id, full_name }) => ({
              id,
              full_name: go(
                rangeL(full_name.length),
                mapL((n) => (n ? '*' : split('', full_name)[n])),
                join('')
              ),
            }),
          }}
          - ratings
        ${Reviews.ratings}`;

    console.log(product)

    res.render('index', {
      title: `${product.name}`,
      body: renderProduct(product),
    });
  } catch (err) {
    console.log(err);
    next();
  }
});

module.exports = router;
