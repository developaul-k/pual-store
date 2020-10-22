var express = require('express');
var router = express.Router();

const { QUERY, VALUES } = require('../database');

router.get('/', async function (req, res, next) {
  if (req.session.user) return res.redirect('/');
  res.render('signup');
});

router.post('/', async function ({ body }, res, next) {
  try {
    await QUERY`
      INSERT INTO users ${VALUES(body)}
    `;

    res.json({ data: {}, message: '회원가입 완료 로그인 페이지로 이동합니다.' });
  } catch (err) {
    console.log(err);
    res.next();
  }
});

module.exports = router;
