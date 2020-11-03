const express = require('express');
const router = express.Router();
const passport = require('passport');
const { QUERY, QUERY1, VALUES } = require('../database');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { hash } = require('../verify');
const { renderSignin, renderSignup } = require('../template/auth');

router.get('/signin', isNotLoggedIn, async function (req, res, next) {
  res.render('index', { title: 'Sign in', body: renderSignin() });
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

router.post('/signup', isNotLoggedIn, async function (req, res) {
  try {
    const { body, body: { email, password } } = req;

    const existUser = await QUERY1`SELECT * FROM users WHERE email = ${email}`;

    if (existUser) return res.send({ message: '이미 가입된 유저입니다.' });

    await QUERY`INSERT INTO users ${VALUES({...body, password: await hash(password)})}`;

    res.send({
      redirectTo: `/auth/signin?email=${encodeURIComponent(email)}`,
      message: '회원가입 완료!',
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: '알 수 없는 오류가 발생했습니다.',
    });
  }
});

router.get('/signout', isLoggedIn, function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/auth/signin');
});

module.exports = router;
