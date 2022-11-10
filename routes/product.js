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
	let query = "SELECT product_id, product_name, product_description, product_quantity, product_price FROM product";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('product/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show',  function(req, res, next) {
let query = "SELECT product_id, product_name, product_description, product_quantity, product_price FROM product WHERE product_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('product/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('product/addrec');
});

//insert
router.post('/', adminonly, function(req, res, next) {
let insertquery = "INSERT INTO product (product_name, product_description, product_quantity, product_price) VALUES (?,?,?,?)";
db.query(insertquery,[req.body.productname,req.body.description,req.body.productquantity,req.body.productprice],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
	} else {
	res.redirect('/product');
}
});
});

//edit 
router.get('/:recordid/edit', adminonly, function(req, res, next) {
	
let query = "SELECT product_id, product_name, product_description, product_quantity, product_price FROM product WHERE product_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('product/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE product SET product_name=?, product_description=?, product_quantity=?, product_price=?  WHERE product_id =  " + req.body.product_id;
db.query(updatequery,[req.body.productname,req.body.description,req.body.productquantity,req.body.productprice],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/product');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM product WHERE product_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/product');
}
});
});

module.exports = router;