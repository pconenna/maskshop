var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const mariadb = require('mariadb/callback');
const db = mariadb.createConnection({host: 'eagle.cdm.depaul.edu', user: 'pconenna', password: 'pconenna', database: 'maskshop'});
const session = require('express-session');


// connect to database
db.connect((err) => {
if (err) {
console.log("Unable to connect to database due to error: " + err);
res.render('error');
} else
{
console.log("Connected to DB");
}
});
global.db = db;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var privacyRouter = require('./routes/privacy');
var helpRouter = require('./routes/help');
var customerRouter = require('./routes/customer');
var employeeRouter = require('./routes/employee');
var productRouter = require('./routes/product');
var suppliersRouter = require('./routes/suppliers');
var financialRouter = require('./routes/financial');
var saleRouter = require('./routes/sale');
var searchRouter = require('./routes/search');
var reportRouter = require('./routes/report');
var catalogRouter = require('./routes/catalog');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({secret: 'mynamejeff'}));
app.use(function(req,res,next){
	res.locals.session = req.session;
	next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/privacy', privacyRouter);
app.use('/help', helpRouter);
app.use('/customer', customerRouter);
app.use('/product', productRouter);
app.use('/employee', employeeRouter);
app.use('/suppliers', suppliersRouter);
app.use('/financial', financialRouter);
app.use('/sale', saleRouter);
app.use('/search', searchRouter);
app.use('/report', reportRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
