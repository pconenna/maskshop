var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

//restrict to admin only
function adminonly(req,res,next){
	if(!req.session.isadmin){
		return(res.redirect('customer/login'));
	}
	next();
}

// Route to list all records. Display view to list all records 

router.get('/', adminonly, function(req, res, next) {
	let query = "SELECT customer_id, firstname, lastname FROM customer";

// execute query
db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('customer/allrecords', {allrecs: result });
	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
let query = "SELECT customer_id, firstname, lastname, username, password, email, phone, address1, address2, city, state, zip, isadmin FROM customer WHERE customer_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('customer/onerec', {onerec: result[0] });
		}
	});
});

router.get('/addrecord', function(req, res, next) {
	res.render('customer/addrec');
});

//insert, this is the create, must not be restricted
router.post('/',  function(req, res, next) {
	let insertquery = "INSERT INTO customer (firstname, lastname, username, password, email, phone, address1, address2, city, state, zip, isadmin) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

	var adminchecked=false;
	if(req.body.admin && req.session.isadmin){ // make sure random people can't create admin accounts
		adminchecked = true;
	}
	else{adminchecked = false;}
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if(err) { res.render('error');}


			db.query(insertquery,[req.body.firstname,req.body.lastname,req.body.username,hash,req.body.email,req.body.phone,req.body.address1,req.body.address2,req.body.city,req.body.state,req.body.zip,adminchecked],(err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
			res.redirect('/customer');
			}	
			});
		});
	});

});

//edit 
router.get('/:recordid/edit', adminonly, function(req, res, next) {
	
let query = "SELECT customer_id, firstname, lastname, username, password, email, phone, address1, address2, city, state, zip, isadmin FROM customer WHERE customer_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.render('customer/editrec', {onerec: result[0] });
}
});
});

//save edits
router.post('/save', adminonly, function(req, res, next) {
let updatequery = "UPDATE customer SET firstname=?, lastname=?, username=?, password=?, email=?, phone=?, address1=?, address2=?, city=?, state=?, zip=?, isadmin=?  WHERE customer_id =  " + req.body.customer_id;

var adminchecked=false;
	if(req.body.admin){adminchecked = true;}
	else{adminchecked = false;}
db.query(updatequery,[req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.email,req.body.phone,req.body.address1,req.body.address2,req.body.city,req.body.state,req.body.zip,adminchecked],(err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/customer');
}
});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
let query = "DELETE FROM customer WHERE customer_id = " + req.params.recordid;
// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
	res.redirect('/customer');
}
});
});

//enable registration
router.get('/register', function(req, res, next) {
	res.render('customer/addrec');
	});

//login page
router.get('/login', function(req, res, next) {
	res.render('customer/login', {message: "Please Login"});
	});


//check login credentials 
/*i think there is a bug in this somewhere 
when i try to log in with accounts that were created by using sql statements to insert sample data in the database in assignment 3
they do not work, the app doen't check the password correctly and it always comes up as wrong even if it is not
it works fine for accounts created via the form in the addrec page
maybe it's not a bug */
router.post('/login', function(req, res, next) {
	let query = "select customer_id, firstname, lastname, password, isadmin from customer WHERE username = '" + req.body.username + "'"; 
	// execute query
	db.query(query, (err, result) => {
		if (err) {res.render('error');} 
		else {
			if(result[0])
				{
				// Username was correct. Check if password is correct
				bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
					if(result1) {
						// Password is correct. Set session variables for user.
						var custid = result[0].customer_id;
						req.session.person_id = custid;
						var custname = result[0].firstname + " "+ result[0].lastname;
						req.session.custname = custname;
						var isadmin = result[0].isadmin;
						req.session.isadmin = isadmin;
						res.redirect('/');
					} else {
						// password do not match
						res.render('customer/login', {message: "Wrong Password"});
					}
				});
				}
			else {
				res.render('customer/login', {message: "Wrong Username"});
				}
		} 
	});
});


router.get('/logout', function(req, res, next) {
    // Empty out the customer identification session variables
   req.session.person_id = 0;
   req.session.custname = "";
   req.session.isadmin = 0;
   //req.session.isadmin = 0;
   // Empty out the items from the cart and quantity arrays
   req.session.cart = [];
   req.session.qty = [];
   res.redirect('/');
});

module.exports = router;
