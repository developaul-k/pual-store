const omitBy = require('fxjs/Strict/omitBy');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { QUERY1, SQL } = require('../database');
const { verify } = require('../verify');

module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await QUERY1`
        SELECT id, email, full_name, address, phone, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth
        FROM users WHERE id = ${id}`;

      done(null, user);
    } catch (err) {
      console.log(err);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (email, password, done) {
        try {
          const user = await QUERY1`SELECT id, password FROM users WHERE email = ${email}`;

          if (!user)
            return done(null, false, {
              message: '아이디 또는 비밀번호가 일치 하지 않습니다.',
            });

          const verifyPassword = await verify(password, user.password);

          if (verifyPassword) {
            return done(null, { id: user.id });
          } else {
            return done(null, false, {
              message: '아이디 또는 비밀번호가 일치 하지 않습니다.',
            });
          }
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );
};
