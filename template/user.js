const { Button } = require("../components/utils");

const renderChangeInfo = ({ address, phone, date_of_birth }) => `
  <section class="change-info">
    <h1 class="h1">회원정보수정</h1>
    <form>
      <section class="round-box">
        <div class="column">
          <input type="password" name="password" class="input" placeholder="비밀번호를 입력해주세요.">
        </div>
        <div class="column">
          <input type="text" name="address" class="input" placeholder="주소를 입력해주세요." value="${address}">
        </div>
        <div class="column">
          <input type="text" name="phone" class="input" placeholder="핸드폰번호를 입력해주세요." value="${phone}">
        </div>
        <div class="column">
          <input type="text" name="date_of_birth" class="input" placeholder="생년월일을 입력해주세요." value="${date_of_birth}">
        </div>
        <div class="column">
          <span class="error-message"></span>
        </div>
      </section>
      ${Button({type: 'submit', text: '수정', className:'full modify'})}
    </form>
  </section>
`;

module.exports = {
  renderChangeInfo
};