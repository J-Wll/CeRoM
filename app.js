const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");
const crypto = require("node:crypto")
const rateLimit = require('express-rate-limit');
const validator = require('express-validator');
const xss = require('xss');

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100
});

app.use(limiter);

// limits use of inline scripts and styles for protection
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(96).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader("Content-Security-Policy", `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`);
  next();
});

// cookie setup
// secure is false because it requires https
// http only limits it to http/s
// same site protects against css 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  },
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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const validateInput = [
  validator.body('*').trim(),
  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// https://www.npmjs.com/package/xss
"Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist."
const sanitizeInput = [
  validator.body('*').customSanitizer((value, { req }) => {
    // Replace $ with _ in each field value
    let sanitizedValue = value;
    if (typeof value === 'string') {
      sanitizedValue = value.replace(/\$/g, '_');
      sanitizedValue = xss(sanitizedValue);
    }
    return sanitizedValue;
  })
];

app.use(sanitizeInput);
app.use(validateInput);

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
