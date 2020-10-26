const _ = require('fxjs/Strict');

module.exports = ({ username, products, user_id }) => {
  return `<div>
      <h1>안녕하세요! ${username} 님</h1>
      <a href="/cart">장바구니</a>
      <a href="/auth/signout">로그아웃</a>

      <h2 class="h2">신제품</h2>
      <ul class="product-list">
        ${
          products.length
            ? _.map(
                ({ id, image, name, price }) => `
                <li class="product-item" data-id="${id}">
                  <div class="product-image">
                    <img src="${image}" alt="">
                  </div>
                  <div class="product-name">${name}</div>
                  <div class="product-price">${price}</div>
                  <button type="button" class="button cart">장바구니 담기</button>
                </li>
                `,
                products
              )
            : `<div>제품이 없습니다.</div>`
        }
      </ul>
    </div>

    <script>
    if (document.querySelector('.button')) {
      document.querySelector('.button')
        .addEventListener('click', ({ currentTarget }) => {
          fetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ user_id: ${user_id}, product_id: currentTarget.closest('.product-item').dataset.id }),
            headers:{
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(data => console.log(data))
      })
    }
    </script>
  `;
};
