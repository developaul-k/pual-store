const strMap = require('fxjs/Strict/strMap');
const { productDetail } = require('../components/products');

const renderProduct = (product) => `
  <div class="contents">
    ${productDetail(product)}
    ${strMap(({ text, _: { grades: { score } } }) => `
      <div>
        리뷰 내용: ${text}\n
        평점: ${score}
      </div>
    `, product._.reviews)}
  </div>
`;

module.exports = {
  renderProduct,
};
