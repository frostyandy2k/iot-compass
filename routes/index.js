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
router.get('/livinglab', function(req, res) {
  res.render('livinglab');
});

router.get('/livinglab/items', function(req, res) {
	var livinglab_items = {
	  "EmbeddedBusinessSystems": {
	    location: {dir: 40},
	    img: "demosTECOIntranet/EBS_front.JPG"
	  },
	  "VDAR": {
	    location: {dir: 50},
	    img: "demosTECOIntranet/VDAR_Logo.jpg"
	  },
	  "AudioLedLampe": {
	    location: {dir: 30},
	    status: false,
	    controlON: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0000C3A9FC/on",
	    controlOFF: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0000C3A9FC/off",
	    img: "demosTECOIntranet/ThumbAudioLed.jpg"
	  },
	  "LedPowerDemo": {
	    location: {dir: 95},
	    img: "demosTECOIntranet/ThumbLedPower.jpg",
	  },
	  "AudioLedLampe1": {
	    location: {dir: 115},
	    status: true,
	    img: "demosTECOIntranet/ThumbAudioLed.jpg"
	  },
	  "PointAndClick": {
	    location: {dir: 155},
	    img: "demosTECOIntranet/ThumbPointAndClick.jpg",
	  },
	  "HealthCareDemo": {
	    location: {dir: 165},
	    img: "demosTECOIntranet/ThumbKneeGuard.jpg",
	  },
	  "TecoEnvboard": {
	    location: {dir: 180},
	    img: "demosTECOIntranet/envboard-demo-neu.jpg",
	  },
	  "RfidCollaborativeCommunicationDemo": {
	    location: {dir: 220},
	    img: "demosTECOIntranet/ThumbRfidCollab.jpg",
	  },
	  "AudioLedLampe2": {
	    location: {dir: 230},
	    status: false,
	    controlON: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0002768C43/on",
	    controlOFF: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0002768C43/off",
	    img: "demosTECOIntranet/ThumbAudioLed.jpg"
	  },
	  "MachineHealthDemo": {
	    location: {dir: 245},
	    img: "demosTECOIntranet/ThumbMachineHealth.jpg",
	  },
	  "AudioLedLampe3": {
	    location: {dir: 290},
	    status: true,
	    img: "demosTECOIntranet/ThumbAudioLed.jpg"
	  },
	  "LandmarkeDemo": {
	    location: {dir: 300},
	    img: "demosTECOIntranet/Landmarke%20Demo.jpg",
	  },
	};
  res.json(livinglab_items);
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
