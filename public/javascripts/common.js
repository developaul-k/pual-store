_.go(
  `
  <div class="loading">
    <span>loading....</span>
  </div>`,
  $.el,
  _.tap(
    $.on('open', ({ currentTarget }) => {
      currentTarget.classList.add('is-active');
    }),
    $.on('close', ({ currentTarget }) => {
      currentTarget.classList.remove('is-active');
    })
  ),
  $.append($.qs('body')));
