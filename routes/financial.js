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
	let query = "SELECT month_id, month_name, monthly_budget, monthly_revenue, supply_expenses, wage_expenses, ad_expenses FROM financial";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('financial/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
let query = "SELECT month_id, month_name, monthly_budget, monthly_revenue, supply_expenses, wage_expenses, ad_expenses FROM financial WHERE month_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('financial/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('financial/addrec');
});

//insert
router.post('/', function(req, res, next) {
let insertquery = "INSERT INTO financial (month_name, monthly_budget, monthly_revenue, supply_expenses, wage_expenses, ad_expenses) VALUES (?,?,?,?,?,?)";
db.query(insertquery,[req.body.monthname,req.body.budget,req.body.revenue,req.body.supply,req.body.wages,req.body.adverts],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
	} else {
	res.redirect('/financial');
}
});
});

//edit 
router.get('/:recordid/edit', adminonly, function(req, res, next) {
	
let query = "SELECT month_id, month_name, monthly_budget, monthly_revenue, supply_expenses, wage_expenses, ad_expenses FROM financial WHERE month_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('financial/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE financial SET month_name=?, monthly_budget=?, monthly_revenue=?, supply_expenses=?, wage_expenses=?, ad_expenses=? WHERE month_id =  " + req.body.month_id;
db.query(updatequery,[req.body.monthname,req.body.budget,req.body.revenue,req.body.supply,req.body.wages,req.body.adverts],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/financial');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM financial WHERE month_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/financial');
}
});
});



module.exports = router;

