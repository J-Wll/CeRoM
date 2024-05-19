const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");
const crypto = require("node:crypto")

const app = express();

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader("Content-Security-Policy", `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`);
  next();
});

// cookie setup
// secure is false because it requires https
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  isAuthenticated: false,
  username: "NOT LOGGED IN",
  admin: false,
  create: false,
  read: false,
  update: false,
  delete: false
}))

mongoose.set("strictQuery", true);
mongoose.connect(
  process.env.MONGO_URI, {
  family: 4,
}
).then(
  () => {
    console.log("Connected to MongoDB");
  }
).catch((error) => {
  console.error(`Connection error ${error}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const productRouter = require('./routes/products');
const customerRouter = require('./routes/customers');
const employeeRouter = require('./routes/employees');
const loginRouter = require('./routes/login');
const changePasswordRouter = require('./routes/changePassword');

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/employees', employeeRouter);
app.use('/login', loginRouter);
app.use('/change-password', changePasswordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (process.env.DEVMODE) {
    res.render("devError")
  } else {
    res.render('error');
  }
});

module.exports = app;
