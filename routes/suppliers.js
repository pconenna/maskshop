var express = require('express');
var router = express.Router();

//restrict to admin only
function adminonly(req,res,next){
	if(!req.session.isadmin){
		return(res.redirect('customer/login'));
	}next();
}

router.get('/', adminonly, function(req, res, next) {
	let query = "SELECT supplier_id, supplier_name, supplier_description FROM suppliers";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('suppliers/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
let query = "SELECT supplier_id, supplier_name, supplier_description FROM suppliers WHERE supplier_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('suppliers/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('suppliers/addrec');
});

//insert
router.post('/', adminonly, function(req, res, next) {
let insertquery = "INSERT INTO suppliers (supplier_name, supplier_description) VALUES (?,?)";
db.query(insertquery,[req.body.suppliername,req.body.description],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
	} else {
	res.redirect('/suppliers');
}
});
});

//edit 
router.get('/:recordid/edit', adminonly, function(req, res, next) {
	
let query = "SELECT supplier_id, supplier_name, supplier_description FROM suppliers WHERE supplier_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('suppliers/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE suppliers SET supplier_name=?, supplier_description=?  WHERE supplier_id =  " + req.body.supplier_id;
db.query(updatequery,[req.body.suppliername,req.body.description],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/suppliers');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM suppliers WHERE supplier_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/suppliers');
}
});
});

module.exports = router;

