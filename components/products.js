const strMap = require('fxjs/Strict/strMap');
const { Button } = require('./utils');

const productDetail = ({ id, name, price, image }) => {
  return `
    <div class="column-box" data-id="${id}">
      <div class="column">
        ${strMap((src) => `<img src="${src}" alt="${name}"/>`, image)}
      </div>
      <div class="column">
        <div style="font-size: 24px; font-weight: bold">${name}</div>
        <div>Price: ${Number(price).toLocaleString()}</div>
        ${Button({ text: '장바구니 담기', className: 'cart' })}
      </div>
    </div>
  `;
};

const productsItem = ({ id, image, name, price, buttonText = '장바구니 담기' }) => `
  <li class="product-item" data-id="${id}">
    <a href="/product/${id}">
      <div class="product-image">
        <img src="${image}" alt="">
      </div>
      <div class="product-name">${name}</div>
      <div class="product-price">${Number(price).toLocaleString()} 원</div>
    </a>
    ${Button({text: buttonText, className: 'cart'})}
  </li>
`;

module.exports = {
  productsItem,
  productDetail
};
