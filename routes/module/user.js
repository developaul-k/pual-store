const express = require('express');
const router = express.Router();
const { QUERY1 } = require('../../database');
const { isLoggedIn } = require('../../middlewares');
const { renderChangeInfo } = require('../../template/user');
const { verify } = require('../../verify');

router.get('/info', isLoggedIn, function (req, res, next) {
  res.render('index', { title: '회원정보', body: '<div>회원정보</div>' });
});

router.get('/changeInfo', isLoggedIn, function (req, res, next) {
  const {
    user: {
      address,
      phone,
      date_of_birth
    }
  } = req;

  res.render('index', {
    title: '회원정보수정',
    body: renderChangeInfo({ address, phone, date_of_birth}),
    pageScript: ['user.js']
  });
});

router.post('/change-info', isLoggedIn, async function(req, res, next) {
  try {
    const { user: { id }, body: { password, address, phone, date_of_birth } } = req;

    const user = await QUERY1`SELECT password FROM users WHERE id = ${id}`;

    if (!await verify(password, user.password)) return res.send({ message: '비밀번호가 일치하지 않습니다.' });

    await QUERY1`
      UPDATE users
      SET address = ${address}, phone = ${phone}, date_of_birth = ${date_of_birth}
      WHERE id = ${id}`

    res.send({ redirectTo: '/mypage', message: '수정완료' });
  } catch(err) {
    console.log(err);
    next(err);
  }
})

module.exports = router;
