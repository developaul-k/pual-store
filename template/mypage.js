const strMap = require("fxjs/Strict/strMap");

const renderMain = (orders) => `
  <div>
    <h1 class="h1">마이페이지</h1>
    <a href="/user/changeInfo">회원정보수정</a>
    <h2 class="h2">주문내역</h2>
    <table class="table-style type2">
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
              <td class="center">${id}</td>
              <td>
                <a href="/orders/${id}">
                  ${products[0].name} ${pdLeng > 1 ? `외 ${pdLeng - 1}건` : ''}
                </a>
              </td>
              <td class="center">${order_date}</td>
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
