var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	// show active promos on home page
let query = "SELECT promo_id, promotitle, promoimage FROM promotion WHERE startdate <= CURRENT_DATE() and enddate >= CURRENT_DATE()"; 
   // execute query
db.query(query, (err, result) => {
	if (err) {
		console.log(err);
		res.render('error');
      }
res.render('index', {promos: result });
     });
 
});

module.exports = router;
