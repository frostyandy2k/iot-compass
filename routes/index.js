var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Kitchen' });
});

router.get('/tillsoffice', function(req, res) {
  res.render('tillsoffice', { title: 'Tills Office' });
});

router.get('/matthiasoffice', function(req, res) {
  res.render('matthiasoffice', { title: 'Matthias Office' });
});

router.get('/preview', function(req, res) {
  res.render('index', { title: 'Kitchen' });
});

module.exports = router;
