const { productDetail } = require('../components/products');
const { renderReviews } = require('../components/reviews');

const renderProduct = (product) => `
  <div class="contents">
    ${productDetail(product)}
    ${renderReviews(product._.reviews)}
  </div>
`;

module.exports = {
  renderProduct,
};
