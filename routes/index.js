const indexRouter = require('./module/index');
const usersRouter = require('./module/users');
const cartRouter = require('./module/cart');
const authRouter = require('./module/auth');
const productRouter = require('./module/product');
const mypageRouter = require('./module/mypage');
const ordersRouter = require('./module/orders');

module.exports = (app) => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/cart', cartRouter);
  app.use('/auth', authRouter);
  app.use('/product', productRouter);
  app.use('/mypage', mypageRouter);
  app.use('/orders', ordersRouter);
}