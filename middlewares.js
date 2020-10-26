const isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  console.log('로그인 안했어요!');
  res.redirect('/auth/signin');
};

const isNotLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) return next();
  console.log('로그인 했어요!');
  res.redirect('/');
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
};
