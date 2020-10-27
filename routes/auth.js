const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('fxjs/Strict');

const { QUERY, VALUES } = require('../database');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { hash } = require('../verify');

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
      <div>
        <input type="text" name="date_of_birth" class="input" placeholder="생년월일을 입력해주세요.">
      </div>
      <div class="column">
        <button type="submit" class="button">회원가입</button>
      </div>
      <div class="column">
        이미 계정이 있으신가요?
        <a href="/auth/signin">로그인</a>
      </div>
      <div class="column">
        <span class="error-message"></span>
      </div>
    </div>
  </form>
</div>

<script src="/javascripts/signup.js"></script>
`;

router.get('/signin', isNotLoggedIn, async function (req, res, next) {
  res.render('index', { title: '로그인', body: renderSignin() });
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) return res.json({ message: info.message });

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.json({
        redirectTo: '/',
      });
    });
  })(req, res, next);
});

router.get('/signup', isNotLoggedIn, function (req, res, next) {
  res.render('index', { title: '회원가입', body: renderSignup() });
});

router.post('/signup', isNotLoggedIn, async function (
  { body, body: { email, password } },
  res,
  next
) {
  try {
    const existUser = await QUERY`SELECT * FROM users WHERE email = ${email}`;

    if (existUser.length) {
      return res.send({
        message: '이미 가입된 유저입니다.',
      });
    }

    _.go(
      hash(password),
      (password) => QUERY`INSERT INTO users ${VALUES({ ...body, password })}`,
      res.send({
        redirectTo: `/auth/signin?email=${encodeURIComponent(email)}`,
        message: '회원가입 완료!',
      })
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/signout', isLoggedIn, function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/auth/signin');
});

module.exports = router;
