_.go(
  $.qs('.checkout-form'),
  $.on('submit', async (e) => {
    e.preventDefault();
    try {
      const products = _.map(([_, v]) => v.split(':'), queryToItrer(location.search));

      $.trigger('open', $.qs('.loading'));

      const { redirectTo } = await $.post('/cart/order-placed', { products });
      location.replace(redirectTo);
    } catch (err) {
      $.trigger('close', $.qs('.loading'));
      console.log(err);
    }
  })
);
