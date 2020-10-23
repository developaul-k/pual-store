const express = require('express');
const router = express.Router();
const POOL = require('../database');

const { QUERY } = POOL;

router.post('/', async function (req, res, next) {
  const { email } = req.body;
  try {
    const [user] = await QUERY`SELECT * FROM users WHERE email = ${email}`;

    if (user) {
      req.session.user = user;
      return res.json({ data: user, token: user.id });
    }

    res.json({
      data: {},
      message: '이메일 또는 비밀번호가 일치 하지 않습니다.',
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.clearCookie('sid');

  return res.status(200).redirect('/signin');
});

module.exports = router;
