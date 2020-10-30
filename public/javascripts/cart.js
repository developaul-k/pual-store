_.go(
  $.qsa('.checkbox'),
  $.on('change', () => {
    _.go($.qsa('.checkbox:checked'), ({ length }) => {
      const $check_all = $.qs('.checkbox-all');
      const $delete_cart = $.qs('.delete-cart');

      if (length == 0) {
        $.setAttr({ disabled: true }, $delete_cart);
      } else if (length == $.qsa('.checkbox').length) {
        $check_all.checked = true;
      } else {
        $check_all.checked = false;
        $.removeAttr('disabled', $delete_cart);
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
      (bool) => _.each((el) => (el.checked = bool), $.qsa('.checkbox'))
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

      _.go(
        $.qsa(sel),
        _.map((el) => $.data($.closest('tr', el)).id),
        (cart_ids) => $.delete('/cart/delete', { cart_ids }),
        ({ redirectTo }) => location.replace(redirectTo)
      ).catch((err) => {
        $.trigger('close', $.qs('.loading'));
        console.log('err');
      });
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
  $.on('click', async (e) => {
    const queryString = _.go(
      $.qsa('.checkbox:checked'),
      L.map(({value}) => `products=${value}`),
      _.join('&'));

    location.href = `http://localhost:3000/cart/checkout?${queryString}`;
  })
);
