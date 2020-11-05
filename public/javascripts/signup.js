_.go(
  $.qs('.form'),
  $.on('submit', (e) => {
    e.preventDefault();

    const {
      currentTarget: {
        email,
        password,
        full_name,
        address,
        phone,
        date_of_birth,
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
