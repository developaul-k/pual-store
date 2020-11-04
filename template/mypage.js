const strMap = require("fxjs/Strict/strMap");

const renderMain = ({ user, orders }) => `
  <div>
    <h1 class="h1">마이페이지</h1>
    <h2 class="h2">안녕하세요! ${user.full_name} 님</h2>
    <table>
      <thead>
        <tr>
          <th>주문번호</th>
          <th>주문상품</th>
          <th>주문시간</th>
        </tr>
      </thead>
      <tbody>
        ${strMap(
          ({ id, order_date, _: {
              products,
              products: { length: pdLeng },
            },
          }) => `
            <tr>
              <td>${id}</td>
              <td>${products[0].name} ${pdLeng > 1 ? `외 ${pdLeng - 1}건` : ''}</td>
              <td>${order_date}</td>
            </tr>
          `,
          orders)}
      </tbody>
    </table>
  </div>
`;

module.exports = {
  renderMain
}
