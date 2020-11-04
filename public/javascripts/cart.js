_.go(
  $.qsa('.checkbox'),
  $.on('change', () => {
    _.go($.qsa('.checkbox:checked'), ({ length: checkedLength }) => {
      const $checkout = $.qs('.checkout');
      const $check_all = $.qs('.checkbox-all');
      const $delete_cart = $.qs('.delete-cart');

      const disabledButtons = () => {
        $.removeAttr('disabled', $delete_cart);
        $.removeAttr('disabled', $checkout);
      }

      if (checkedLength == 0) {
        $.setAttr({ disabled: true }, $delete_cart);
        $.setAttr({ disabled: true }, $checkout);
        $check_all.checked = false;
      } else if (checkedLength == $.qsa('.checkbox').length) {
        $check_all.checked = true;
        disabledButtons();
      } else {
        $check_all.checked = false;
        disabledButtons();
      }
    });
  })
);

_.go(
  $.qs('.checkbox-all'),
  $.on('change', ({ currentTarget }) =>
    _.go(
      currentTarget,
      ({ checked }) => checked,
      (bool) => _.each((el) => (el.checked = bool), $.qsa('.checkbox')),
      _ => $.trigger('change', $.qs('.checkbox'))
    )
  )
);

_.go(
  $.qsa('.delete-cart'),
  $.on('click', async ({ currentTarget }) => {
    const typeAll = currentTarget.getAttribute('data-type') == 'all';
    const sel = typeAll ? '.checkbox' : '.checkbox:checked';
    const message = typeAll
      ? '전체 상품을 삭제하시겠습니까?'
      : '선택한 상품을 삭제하시겠습니까?';

    if (confirm(message)) {
      $.trigger('open', $.qs('.loading'));

      try {
        const cart_ids = _.map((el) => $.data($.closest('tr', el)).id, $.qsa(sel));
        const { redirectTo } = await $.delete('/cart/delete', { cart_ids });
        location.replace(redirectTo);
      } catch(err) {
        $.trigger('close', $.qs('.loading'));
        console.log('err');
      }
    }
  })
);

_.go(
  $.qsa('select'),
  $.on('change', ({ currentTarget }) =>
    _.go(
      currentTarget,
      $.find('option:checked'),
      _.tap((_) => $.trigger('open', $.qs('.loading'))),
      async ({ value: amount }) => {
        try {
          const { id } = $.data($.closest('tr', currentTarget));
          const { redirectTo } = await $.put('/cart/update', { id, amount });
          location.replace(redirectTo);
        } catch (err) {
          $.trigger('close', $.qs('.loading'));
          console.log(err);
        }
      }
    )
  )
);

_.go(
  $.qs('.checkout'),
  $.on('click', () =>
    _.go(
      $.qsa('.checkbox:checked'),
      L.map(({ value }) => `products=${encodeURIComponent(value)}`),
      _.join('&'),
      (qstr) => (location.href = `http://localhost:3000/cart/checkout?${qstr}`)
    )
  )
);