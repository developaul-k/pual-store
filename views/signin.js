module.exports = () => `
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
          <button type="submit" class="button">로그인</button>
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
