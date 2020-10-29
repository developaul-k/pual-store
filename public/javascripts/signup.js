const checkValidate = (iter) => {
  for (const a of iter) {
    if (a === '') return false;
  }
  return true;
};

const errMsg = (msg) => _.go($.qs('.error-message'), $.text(msg), $.show);

_.go(
  $.qs('.form'),
  $.on('submit', (e) => {
    e.preventDefault();

    const {
      currentTarget: {
        email: { value: email },
        password: { value: password },
        full_name: { value: full_name },
        address: { value: address },
        phone: { value: phone },
        date_of_birth: { value: date_of_birth },
      },
    } = e;

    if (!checkValidate([email, full_name, address, phone, date_of_birth]))
      return errMsg('이메일 또는 비밀번호를 입력해주세요!');

    _.go(
      $.post('/auth/signup', {
        email,
        password,
        full_name,
        address,
        phone,
        date_of_birth,
      }),
      ({ redirectTo, message }) => {
        if (redirectTo) {
          alert(message);
          location.replace(redirectTo);
        } else {
          errMsg(message);
        }
      }
    );
  })
);

_.go(
  $.qsa('.input'),
  $.on('focus', () =>
    _.go(
      $.qsa('.error-message'),
      _.each((el) => el.style.display == 'block' && $.hide(el))
    )
  )
);
