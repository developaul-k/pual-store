const strMap = require('fxjs/Strict/strMap');
const { productsItem } = require('../components/products');

module.exports = ({ user, products }) => `
  <div>
    <h1>안녕하세요! ${user.full_name} 님</h1>
    <a href="/mypage">마이페이지</a>
    <a href="/cart">장바구니</a>
    <a href="/auth/signout">로그아웃</a>

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
