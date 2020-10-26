const express = require('express');
const router = express.Router();
const passport = require('passport');
const { QUERY, VALUES } = require('../database');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const layout = require('../views/layout');
const signin = require('../views/signin');
const signup = require('../views/signup');

router.get('/signin', isNotLoggedIn, async function (req, res, next) {
  console.log('/signin: isNotLoggedIn');
  res.send(layout('Signin', signin()));
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  console.log('/signin: isNotLoggedIn');
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
  res.send(layout('Signup', signup()));
});

router.post('/signup', isNotLoggedIn, async function (req, res, next) {
  try {
    const existUser = await QUERY`SELECT * FROM users WHERE email = ${req.body.email}`;

    if (existUser.length) {
      return res.send({
        message: '이미 가입된 유저입니다.',
      });
    }

    await QUERY`INSERT INTO users ${VALUES(req.body)}`;

    res.send({
      redirectTo: '/auth/signin',
      message: '회원가입 완료!',
    });
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
