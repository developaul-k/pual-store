_.go(
  $.qs('form'),
  $.on('submit', (e) => {
    e.preventDefault();

    const {
      currentTarget: { password, address, phone, date_of_birth },
    } = e;

    if (!checkValidate([password, address, phone, date_of_birth]))
      return errMsg('모든 입력란을 채워주세요');

    $.trigger('open', $.qs('.loading'));
    _.go(
      $.post('/user/change-info', {
        password: password.value,
        address: address.value,
        phone: phone.value,
        date_of_birth: date_of_birth.value,
      }),
      ({ redirectTo, message }) => {
        if (redirectTo) {
          alert(message);
          location.replace(redirectTo);
        } else {
          errMsg(message);
          $.trigger('close', $.qs('.loading'));
        }
      }
    ).catch((err) => {
      $.trigger('close', $.qs('.loading'));
      console.log(err);
    });
  })
);
