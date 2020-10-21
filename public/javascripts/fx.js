const add = (a, b) => a + b;

const nop = Symbol('nop');

const isIterable = (a) => a && a[Symbol.iterator];

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs);

const curry = (f) => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);

const L = {};

const C = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) yield i;
};

L.map = curry(function* (f, iter) {
  for (const a of iter) yield go1(a, f);
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    let b = go1(a, f);
    if (b instanceof Promise)
      yield b.then((b) => (b ? a : Promise.reject(nop)));
    else if (b) yield a;
  }
});

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

L.flatMap = curry(pipe(L.map, L.flatten));

L.take = curry(function* (l, iter) {
  for (const a of iter) {
    if (a instanceof Promise) yield a.then((a) => (--l, a));
    else yield (--l, a);
    if (!l) break;
  }
});

const take = curry((l, iter) => {
  let res = [];

  iter = iter[Symbol.iterator]();

  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a
          .then((a) => ((res.push(a), res).length == l ? res : recur()))
          .catch((e) => (e == nop ? recur() : Promise.resolve(e)));
      }

      res.push(a);
      if (res.length == l) return res;
    }

    return res;
  })();
});

const map = curry(pipe(L.map, take(Infinity)));

const filter = curry(pipe(L.filter, take(Infinity)));

const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));

const reduceF = (acc, a, f) =>
  a instanceof Promise
    ? a.then(
        (a) => f(acc, a),
        (e) => (e == nop ? acc : Promise.reject(e))
      )
    : f(acc, a);

const head = (iter) => go1(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
  if (!iter) return reduce(f, head((iter = acc[Symbol.iterator]())), iter);
  iter = iter[Symbol.iterator]();

  // console.log(f, acc, iter);

  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      // console.log('cur.value', cur.value)
      acc = reduceF(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});

const range = (l) => {
  let i = -1;
  let res = [];

  while (++i < l) res.push(i);

  return res;
};

const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);

const queryStr = (obj) => go(obj, L.entries, map(join('=')), join('&'), log);

const find = (f, iter) => go(iter, L.filter(f), take(1), ([a]) => a, log);

const flatten = pipe(L.flatten, take(Infinity));

const flatMap = curry(pipe(L.flatMap, take(Infinity)));

const delay600 = (a) =>
  new Promise((resolve) => setTimeout(() => resolve(a), 600));

function noop() {}

const catchNoop = (arr) => (
  arr.forEach((a) => (a instanceof Promise ? a.catch(noop) : a)), arr
);

C.reduce = curry((f, acc, iter) =>
  iter ? reduce(f, acc, catchNoop([...iter])) : reduce(f, catchNoop([...acc]))
);

C.take = curry((l, iter) => take(l, catchNoop([...iter])));

C.takeAll = C.take(Infinity);

C.map = curry(pipe(L.map, C.takeAll));

C.filter = curry(pipe(L.filter, C.takeAll));

const each = curry((f, iter) => map((a) => go1(f(a), (_) => a), iter));
