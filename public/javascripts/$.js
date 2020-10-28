const $ = {};

$.qs = (sel, parent = document) => parent.querySelector(sel);
$.qsa = (sel, parent = document) => parent.querySelectorAll(sel);

$.find = _.curry($.qs);
$.findAll = _.curry($.qsa);

$.el = tmpl => {
  const wrap = document.createElement('div');
  wrap.innerHTML = tmpl;
  return wrap.children[0];
}

$.closest = _.curry((sel, el) => {
  console.log(el.closest(sel));
  return el.closest(sel);
});

$.on = _.curry((e, f) => (els) =>
  _.each(
    (el) => el.addEventListener(e, f),
    _.isIterable(els) && !els.tagName ? els : [els]
  )
);

$.text = _.curry((text, el) => ((el.innerText = text), el));

$.show = (el) => ((el.style.display = 'block'), el);
$.hide = (el) => ((el.style.display = 'none'), el);

$.hasClass = _.curry((className, el) => el.classList.contain(className));

$.append = _.curry((parent, el) => parent.appendChild(el));

$.data = sel => sel.dataset;