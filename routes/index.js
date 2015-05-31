var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});

router.get('/kitchen', function(req, res) {
  res.render('kitchen', { title: 'Kitchen' });
});

router.get('/tillsoffice', function(req, res) {
  res.render('tillsoffice', { title: 'Tills Office' });
});

router.get('/matthiasoffice', function(req, res) {
  res.render('matthiasoffice', { title: 'Matthias Office' });
});


router.get('/kitchen/items', function(req, res) {
	var kitchen_items = {
	  "microwave": {
	    location: {dir: 350},
	  },
	  "flower": {
	    location: {dir: 270},
	    img: "img/flower.jpg"
	  },
	  "lamp": {
	    location: {dir: 80},
	    controlON: "http://cumulus.teco.edu:81/21345gjphtnch87/ON",
	    controlOFF: "http://cumulus.teco.edu:81/21345gjphtnch87/OFF"
	  },
	  "coffeemachine": {
	    location: {dir: 190},
	    img: "img/coffeemachine.jpg"
	  },
	  "fridge": {
	    location: {dir: 200},
	    img: "img/fridge.jpg"
	  }
	};
  res.json(kitchen_items);
});
router.get('/tillsoffice/items', function(req, res) {
	var tillsoffice_items = {
	  "thesis": {
	    location: {dir: 80},
	  },
	  "flower": {
	    location: {dir: 300},
	    img: "img/flower.jpg"
	  },
	  "telephone": {
	    location: {dir: 160},
	  }
	};
  res.json(tillsoffice_items);
});
router.get('/matthiasoffice/items', function(req, res) {
	var matthiasoffice_items = {
	  "cardboard": {
	    location: {dir: 190},
	  },
	  "flower": {
	    location: {dir: 250},
	    img: "img/flower.jpg"
	  },
	  "budde": {
	    location: {dir: 0},
	  }
	};
  res.json(matthiasoffice_items);
});
module.exports = router;
