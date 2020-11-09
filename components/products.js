const strMap = require('fxjs/Strict/strMap');
const { rating } = require('./reviews');
const { Button } = require('./utils');

const productDetail = ({ id, name, price, image, _: { ratings } }) => {
  return `
    <div class="product-detail">
      <div class="column-box" data-id="${id}">
        <div class="column">
          ${strMap((src) => `<img src="${src}" alt="${name}"/>`, image)}
        </div>
        <div class="column">
          <div style="font-size: 24px; font-weight: bold">${name}</div>
          <div>Price: ${Number(price).toLocaleString()}</div>
          <div class="product-detail__rating">
            ${rating(ratings)}
          </div>
          ${Button({ text: '장바구니 담기', className: 'add-cart full' })}
        </div>
      </div>
    </div>
  `;
};

const productsItem = ({ id, image, name, price, _: { ratings } }) => `
  <li class="products__item" data-id="${id}">
    <a href="/product/${id}">
      <div class="products__image">
        <img src="${image}" alt="">
      </div>
      <div class="products__name">${name}</div>
      <div class="products__price">${Number(price).toLocaleString()} 원</div>
    </a>
    <div class="products__rating">${rating(ratings)}</div>
    ${Button({ text: '장바구니 담기', className: 'add-cart full' })}
  </li>
`;

module.exports = {
  productsItem,
  productDetail,
};
