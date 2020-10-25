const express = require('express');
const router = express.Router();
const passport = require('passport');
// const POOL = require('../database');
const { isNotLoggedIn } = require('../middlewares');

// const { QUERY } = POOL;

router.get('/signin', isNotLoggedIn, async function (req, res, next) {
  res.render('signin');
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
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
  if (req.session.user) return res.redirect('/');
  res.render('signin');
});

module.exports = router;
