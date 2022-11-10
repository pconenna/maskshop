var express = require('express');
var router = express.Router();

//==========
//ALERT!
//this page is a lost page
//==========

//restrict to admin only
function adminonly(req,res,next){
	if(!req.session.isadmin){
		return(res.redirect('customer/login'));
	} next();
}

router.get('/', adminonly, function(req, res, next) {
	let query = "SELECT sale_id, customer_id, product_id, saledate, saleprice, quantity FROM sale";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('sale/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
let query = "SELECT sale_id, customer_id, product_id, saledate, saleprice, quantity FROM sale WHERE sale_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('sale/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('sale/addrec');
});

//insert
router.post('/', adminonly, function(req, res, next) {
let insertquery = "INSERT INTO sale (customer_id, product_id, saledate, saleprice, quantity) VALUES (?,?,?,?,?)";
db.query(insertquery,[req.body.customer_id,req.body.product_id,req.body.saledate,req.body.saleprice,req.body.quantity],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
	} else {
	res.redirect('/sale');
}
});
});

//edit 
router.get('/:recordid/edit', adminonly, function(req, res, next) {
	
let query = "SELECT sale_id, customer_id, product_id, saledate, saleprice, quantity FROM sale WHERE sale_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('sale/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE sale SET customer_id=?, product_id=?, saledate=?, saleprice=?, quantity=?  WHERE sale_id =  " + req.body.sale_id;
db.query(updatequery,[req.body.customer_id,req.body.product_id,req.body.saledate,req.body.saleprice,req.body.quantity],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/sale');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM sale WHERE sale_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/sale');
}
});
});

module.exports = router;