const { Button } = require("../components/utils");

const renderSignin = () => `
  <div class="sign-container login">
    <form class="form">
      <div class="round-box">
        <div class="h1">로그인</div>
        <div class="column">
          <input type="text" name="email" class="input" placeholder="이메일을 입력해주세요.">
        </div>
        <div class="column">
          <input type="password" name="password" class="input" placeholder="비밀번호를 입력해주세요.">
        </div>
        <div class="column">
          ${Button({ type: 'submit', text: '로그인', className: 'full login' })}
        </div>
        <div class="column">
          계정이 없으신가요?
          <a href="/auth/signup">회원가입</a>
        </div>
        <div class="column">
          <span class="error-message"></span>
        </div>
      </div>
    </form>
  </div>

  <script src="/javascripts/signin.js"></script>
`;

const renderSignup = () => `
  <div class="sign-container signup">
    <form class="form">
      <div class="round-box">
        <div class="h1">회원가입</div>
        <div class="column">
          <input type="text" name="email" class="input" placeholder="이메일을 입력해주세요.">
        </div>
        <div class="column">
          <input type="password" name="password" class="input" placeholder="비밀번호를 입력해주세요.">
        </div>
        <div class="column">
          <input type="text" name="full_name" class="input" placeholder="이름을 입력해주세요.">
        </div>
        <div class="column">
          <input type="text" name="address" class="input" placeholder="주소를 입력해주세요.">
        </div>
        <div class="column">
          <input type="text" name="phone" class="input" placeholder="핸드폰번호를 입력해주세요.">
        </div>
        <div class="column">
          <input type="text" name="date_of_birth" class="input" placeholder="생년월일을 입력해주세요.">
        </div>
        <div class="column">
          <span class="error-message"></span>
        </div>
        <div class="column">
          ${Button({ type: 'submit', text: '회원가입', className: 'full login' })}
        </div>
        <div class="column">
          이미 계정이 있으신가요?
          <a href="/auth/signin">로그인</a>
        </div>
      </div>
    </form>
  </div>

  <script src="/javascripts/signup.js"></script>
`;

module.exports = {
  renderSignin,
  renderSignup,
};
