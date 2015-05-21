var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Kitchen' });
});

router.get('/preview', function(req, res) {
  res.render('index', { title: 'Kitchen' });
});

module.exports = router;
