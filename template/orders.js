const strMap = require('fxjs/Strict/strMap');

const renderMain = ({
  user,
  orders: {
    id: order_id,
    order_date,
    _: { products },
  },
  total_prices,
  shipping_cost
}) => `
  <div>
    <h1 class="h1">주문 상세</h1>
    <section>
      <h2 class="h2">구매목록</h2>
      <table class="table-style type2">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문상품</th>
            <th>수량</th>
            <th>금액</th>
            <th>주문시간</th>
          </tr>
        </thead>
        <tbody>
          ${strMap(
            ({ id: product_id, image, name, quantity, price }) => `
              <tr>
                ${products[0].id == product_id ? `<td class="center" rowspan="${products.length}">${order_id}</td>` : ''}
                <td>
                  <a href="/product/${product_id}">
                    <div class="image-text-box small">
                      <img src="${image}" alt="${name}" />
                      <span>${name}</span>
                    </div>
                  </a>
                </td>
                <td>${quantity}</td>
                <td>${price.toLocaleString()} 원</td>
                ${products[0].id == product_id ? `<td class="center" rowspan="${products.length}">${order_date}</td>` : ''}
              </tr>
            `,
            products
          )}
        </tbody>
      </table>
    </section>
    <section>
      <h2 class="h2">결제정보</h2>
      <table class="table-style type1">
        <tbody>
          <tr>
            <th scope="row">총상품가격</th>
            <td>${total_prices.toLocaleString()} 원</td>
          </tr>
          <tr>
            <th scope="row">배송비</th>
            <td>${shipping_cost.toLocaleString()} 원</td>
          </tr>
          <tr>
            <th scope="row">총결제금액</th>
            <td>${(total_prices + shipping_cost).toLocaleString()} 원</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
        <h2 class="h2">배송지 정보</h2>
        <table class="table-style type1">
          <tbody>
            <tr>
              <th scope="row">이름</th>
              <td>${user.full_name}</td>
            </tr>
            <tr>
              <th scope="row">배송주소</th>
              <td>${user.address}</td>
            </tr>
            <tr>
              <th scope="row">연락처</th>
              <td>${user.phone}</td>
            </tr>
          </tbody>
        </table>
      </section>
  </div>
`;

module.exports = {
  renderMain,
};
