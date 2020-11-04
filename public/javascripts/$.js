const $ = {};

$.qs = (sel, parent = document) => parent.querySelector(sel);
$.qsa = (sel, parent = document) => parent.querySelectorAll(sel);

$.find = _.curry($.qs);
$.findAll = _.curry($.qsa);

$.el = (tmpl) => {
  const wrap = document.createElement('div');
  wrap.innerHTML = tmpl;
  return wrap.children[0];
};

$.closest = _.curry((sel, el) => el.closest(sel));

$.on = _.curry((e, f) => (els) =>
  _.each(
    (el) => el.addEventListener(e, f),
    _.isIterable(els) && !els.tagName ? els : [els]
  )
);

$.delegate = (e, els, f) => (parent) =>
  parent.addEventListener(e, (event) =>
    _.go(
      parent,
      $.findAll(els),
      L.filter((el) => event.target.contains(el)),
      _.each((currentTarget) =>
        f({
          ...event,
          currentTarget,
          originalEvent: event,
          delegateTarget: parent,
        })
      )
    )
  );

$.trigger = _.curry((eventName, el) => el.dispatchEvent(new Event(eventName)));

$.text = _.curry((text, el) => ((el.innerText = text), el));

$.show = (el) => ((el.style.display = 'block'), el);
$.hide = (el) => ((el.style.display = 'none'), el);

$.hasClass = _.curry((className, el) => el.classList.contain(className));

$.append = _.curry((parent, el) => parent.appendChild(el));

$.data = (sel) => sel.dataset;

$.removeAttr = _.curry((attr, el) => el.removeAttribute(attr));

$.setAttr = _.curry((attrs, el) => {
  for (const k in attrs) el.setAttribute(k, attrs[k]);

  return el;
});

/* $.get = _.curry((url, body = {}) => {
  const _body = _.go(
    body,
    L.entries,
    L.map(_.join('=')),
    _.join('&'));

  return fetch(url, _body);
}); */

$.post = _.curry((url, body) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' },
  }).then((res) => res.json())
);

$.delete = _.curry((url, body) =>
  fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' },
  }).then((res) => res.json())
);

$.put = _.curry((url, body) =>
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' },
  }).then((res) => res.json())
);
