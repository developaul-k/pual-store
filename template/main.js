const strMap = require('fxjs/Strict/strMap');
const { productsItem } = require('../components/products');

module.exports = ({ products }) => `
  <div class="contents">
    <h2 class="h2">신제품</h2>
    <ul class="product-list">
      ${
        products.length
          ? strMap(productsItem, products)
          : `<div>제품이 없습니다.</div>`
      }
    </ul>
  </div>
`;
