const errMsg = (msg) => _.go($.qs('.error-message'), $.text(msg), $.show);

if (location.search) {
  _.go(
    decodeURIComponent(location.search),
    _.replace('?', ''),
    _.split('&'),
    L.map(_.split('=')),
    _.each(([k, v]) => {
      $.qs(`[name="${k}"]`).value = v;
    })
  );
}

_.go(
  $.qs('.form'),
  $.on('submit', (e) => {
    e.preventDefault();

    const {
      currentTarget: {
        email: { value: emailValue },
        password: { value: passwordValue },
      },
    } = e;

    if (emailValue == '' || passwordValue == '')
      return errMsg('이메일 또는 비밀번호를 입력해주세요!');

    loadingCtrl('open');

    _.go(
      fetch('/auth/signin', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      }),
      (res) => res.json(),
      ({ message, redirectTo }) => {
        loadingCtrl('close');
        if (message) return errMsg(message);
        location.replace(redirectTo);
      }
    ).catch((err) => console.log(err));
  })
);

_.go(
  $.qsa('.input'),
  $.on('focus', () =>
    _.go(
      $.qsa('.error-message'),
      _.each((el) => el.style.display == 'block' && $.hide(el))
    )));
