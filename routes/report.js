var express = require('express');
var router = express.Router();

//restrict to admin only
function adminonly(req,res,next){
	if(!req.session.isadmin){
		return(res.redirect('customer/login'));
    }
    next();
}

router.get('/', adminonly, function(req, res, next) {
  res.render('report/reportmenu');
});


router.get('/productlist', adminonly, function(req, res, next) {
    let query = "SELECT product_id, product_name, product_description, product_quantity, product_price FROM product"; 

    // execute query
    db.query(query, (err, result) => {
          if (err) {
              console.log(err);
              res.render('error');
          }
      res.render('report/productlist', {allrecs: result });
       });


});

router.get('/custlist', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, email, phone, address1, address2, city, state, zip FROM customer"; 

    // execute query
    db.query(query, (err, result) => {
          if (err) {
              console.log(err);
              res.render('error');
          }
      res.render('report/custlist', {allrecs: result });
       });


});
// saleorder and order detail need routes

router.get('/saleorderlist', adminonly, function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, customernotes, paymentstatus FROM saleorder"; 

    // execute query
    db.query(query, (err, result) => {
          if (err) {
              console.log(err);
              res.render('error');
          }
      res.render('report/saleorderlist', {allrecs: result });
       });


});

router.get('/orderdetaillist', adminonly, function(req, res, next) {
    let query = "SELECT orderdetail_id, order_id, product_id, saleprice, qty FROM orderdetail"; 
  
    // execute query
    db.query(query, (err, result) => {
          if (err) {
              console.log(err);
              res.render('error');
          }
      res.render('report/orderdetaillist', {allrecs: result });
       });
  });

module.exports = router;
