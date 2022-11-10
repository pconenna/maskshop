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
	let query = "SELECT employee_id, firstname, lastname, position FROM employee";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('employee/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
let query = "SELECT employee_id, firstname, lastname, email, phone, address1, address2, city, state, zip, hourly_wage, hours_worked, position FROM employee WHERE employee_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('employee/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('employee/addrec');
});

//insert
router.post('/', adminonly, function(req, res, next) {
let insertquery = "INSERT INTO employee (firstname, lastname, email, phone, address1, address2, city, state, zip, hourly_wage, hours_worked, position) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
db.query(insertquery,[req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address1,req.body.address2,req.body.city,req.body.state,req.body.zip,req.body.wage,req.body.hours,req.body.position],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
	} else {
	res.redirect('/employee');
}
});
});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
let query = "SELECT employee_id, firstname, lastname, email, phone, address1, address2, city, state, zip, hourly_wage, hours_worked, position FROM employee WHERE employee_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('employee/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE employee SET firstname=?, lastname=?, email=?, phone=?, address1=?, address2=?, city=?, state=?, zip=?, hourly_wage=?, hours_worked=?, position=? WHERE employee_id = " + req.body.employee_id;
db.query(updatequery,[req.body.firstname,req.body.lastname,req.body.email,req.body.phone,req.body.address1,req.body.address2,req.body.city,req.body.state,req.body.zip,req.body.wage,req.body.hours,req.body.position],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/employee');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM employee WHERE employee_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/employee');
}
});
});

module.exports = router;