const _ = require('fxjs/Strict');

module.exports = ({ cart }) => {
  return `
    <a href="javascript:history.back()">뒤로가기</a>
    <table class="cart">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>상품명</th>
          <th>금액</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        ${_.map(
          ({ id, name, price, amounts, image }) => `
            <tr data-id="${id}">
              <td>
                <input type="checkbox" />
              </td>
              <td class="image">
                ${_.map((src) => `<img src="${src}" alt="${name}" />`, image)}
              </td>
              <td>${name}</td>
              <td class="right">${price}</td>
              <td class="center">${amounts}</td>
            </tr>
          `,
          cart
        )}
      </tbody>
    </table>

    <script type="module" src="/javascripts/cart.js"></script>
  `;
};
