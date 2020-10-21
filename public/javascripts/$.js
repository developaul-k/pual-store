const $ = {};

$.qs = (sel, parent = document) => parent.querySelector(sel);
$.qsa = (sel, parent = document) => parent.querySelectorAll(sel);

$.find = curry($.qs);
$.findAll = curry($.qsa);

$.closest = curry((sel, el) => {
  console.log(el.closest(sel));
  return el.closest(sel);
});

$.on = curry((e, f) => (els) =>
  each(
    (el) => el.addEventListener(e, f),
    isIterable(els) && !els.tagName ? els : [els]
  )
);

$.text = curry((text, el) => ((el.innerText = text), el));

$.show = (el) => ((el.style.display = 'block'), el);
$.hide = (el) => ((el.style.display = 'none'), el);

$.hasClass = curry((className, el) => el.classList.contain(className));
