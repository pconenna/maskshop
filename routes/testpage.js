var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('testpage', { title: 'test page' });
});

module.exports = router;