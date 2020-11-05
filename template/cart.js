const rangeL = require('fxjs/Lazy/rangeL');
const { map, strMap } = require('fxjs/Strict');
const { Button } = require('../components/utils');

const renderMain = (cart) => {
  const isDisabled = cart.length ? '' : 'disabled';

  return `
    <div class="contents">
      <section class="cart">
        <h1>장바구니</h1>
        <table class="table-style type2">
          <thead>
            <tr>
              <th class="left">
                <input type="checkbox" class="checkbox-all" checked ${isDisabled} />
              </th>
              <th></th>
              <th>상품명</th>
              <th>금액</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            ${strMap(
              ({ id, product_id, name, price, amount, image }) => `
                <tr data-id="${id}">
                  <td>
                    <input type="checkbox" class="checkbox" value="${product_id}:${amount}" checked />
                  </td>
                  <td class="image">
                    ${map((src) => `<img src="${src}" alt="${name}" />`, image)}
                  </td>
                  <td>${name}</td>
                  <td class="right">${price.toLocaleString()} 원</td>
                  <td class="center">
                    <select>
                      ${strMap(
                        (n) =>
                          `<option value="${n}" ${
                            amount == n ? 'selected' : ''
                          }>${n}</option>`,
                        rangeL(1, amount + 1)
                      )}
                    </select>
                  </td>
                </tr>
              `,
              cart
            )}
          </tbody>
        </table>
        <div class="button-box">
          ${Button({
            text: '선택상품삭제',
            className: 'delete-cart group',
            size: 'medium',
            isDisabled,
          })}
          ${Button({
            text: '전체상품삭제',
            className: 'delete-cart group',
            size: 'medium',
            isDisabled,
            attrs: 'data-type="all"',
          })}
          ${Button({
            text: '주문하기',
            className: 'checkout group',
            size: 'medium',
            isDisabled,
          })}
        </div>
      </section>
    </div>
  `;
};

const renderCheckout = ({ user, products, total_prices, shipping_cost }) => `
  <div class="contents">
    <section class="cart">
      <h1 class="h1">주문/결제</h1>
      <form class="checkout-form">
        <section>
          <h2 class="h2">구매자정보</h2>
          <table class="table-style type1">
            <tbody>
              <tr>
                <th scope="row">이름</th>
                <td>${user.full_name}</td>
              </tr>
              <tr>
                <th scope="row">이메일</th>
                <td>${user.email}</td>
              </tr>
              <tr>
                <th scope="row">연락처</th>
                <td>${user.phone}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2 class="h2">받는사람정보</h2>
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
        <section>
          <h2 class="h2">구매목록</h2>
          <table class="table-style type2">
            <thead>
              <tr>
                <th></th>
                <th>상품명</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              ${strMap(
                ({ name, image, amount }) => `
                  <tr>
                    <td class="image">
                      ${strMap((src) => `<img src="${src}" alt="name" />`, image)}
                    </td>
                    <td>${name}</td>
                    <td class="center">${amount} 개</td>
                  </tr>
                `, products)}
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
        <div class="button-box center">
          ${Button({ type: 'submit', text: '결제하기', className: 'order-placed' })}
        </div>
      </form>
    </section>
  </div>
`;

module.exports = {
  renderMain,
  renderCheckout,
};
