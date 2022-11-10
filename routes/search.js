var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
let query = "SELECT product_id, product_name, product_description, product_quantity, product_price FROM product WHERE product_description LIKE '%" + req.query.searchcriteria + "%'";
console.log("Query: " + query ); // this line is for testing purposes 

// execute query
db.query(query, (err, result) => {
if (err) {
	console.log(err);
	res.render('error');
} else {
res.render('search', {allrecs: result});
}
});
});
module.exports = router;