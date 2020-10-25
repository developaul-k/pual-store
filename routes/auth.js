const express = require('express');
const router = express.Router();
const passport = require('passport');
// const POOL = require('../database');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');

// const { QUERY } = POOL;

router.get('/signin', isNotLoggedIn, async function (req, res, next) {
  console.log('/signin: isNotLoggedIn');
  res.render('signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  console.log('/signin: isNotLoggedIn');
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/auth/signin?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('signup', isNotLoggedIn, function (req, res, next) {
  console.log('/signin: isNotLoggedIn');
  res.render('signin');
});

router.get('/signout', isLoggedIn, function (req, res, next) {
  console.log('/signin: isLoggedIn');
  req.logout();
  req.session.destroy();
  res.redirect('/auth/signin');
});

module.exports = router;
