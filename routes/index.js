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

router.get('/livinglab2DM', function(req, res) {
  res.render('livinglab2DM');
});
// router.get('/livinglab.html', function(req, res) {
//   res.render('livinglab2DM');
// });

router.get('/livinglab/items', function(req, res) {
	var livinglab_items = {
	  "EmbeddedBusinessSystems": {
	    location: {dir: 50},
	    img: "demosTECOIntranet/EBS_front_radar.png"
	  },
	  "VDAR": {
	    location: {dir: 60},
	    img: "demosTECOIntranet/VDAR_Logo_radar.png"
	  },
	  "AudioLedLampe": {
	    location: {dir: 40},
	    status: true,
	    controlON: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0000C3A9FC/on",
	    controlOFF: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0000C3A9FC/off",
	    img: "demosTECOIntranet/ThumbAudioLed_radar.png"
	  },
	  "LedPowerDemo": {
	    location: {dir: 110},
	    img: "demosTECOIntranet/ThumbLedPower_radar.png",
	  },
	  "AudioLedLampe1": {
	    location: {dir: 160},
	    status: true,
	    img: "demosTECOIntranet/ThumbAudioLed_radar.png"
	  },
	  "PointAndClick": {
	    location: {dir: 180},
	    img: "demosTECOIntranet/ThumbPointAndClick_radar.png",
	  },
	  "HealthCareDemo": {
	    location: {dir: 190},
	    img: "demosTECOIntranet/ThumbKneeGuard_radar.png",
	  },
	  "TecoEnvboard": {
	    location: {dir: 200},
	    img: "demosTECOIntranet/envboard-demo-neu_radar.png",
	  },
	  "RfidCommunicationDemo": {
	    location: {dir: 260},
	    img: "demosTECOIntranet/ThumbRfidCollab_radar.png",
	  },
	  "AudioLedLampe2": {
	    location: {dir: 270},
	    status: true,
	    controlON: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0002768C43/on",
	    controlOFF: "http://tecodemopc.teco.edu:5000/plugwise/000D6F0002768C43/off",
	    img: "demosTECOIntranet/ThumbAudioLed_radar.png"
	  },
	  "MachineHealthDemo": {
	    location: {dir: 280},
	    img: "demosTECOIntranet/ThumbMachineHealth_radar.png",
	  },
	  "AudioLedLampe3": {
	    location: {dir: 320},
	    status: true,
	    img: "demosTECOIntranet/ThumbAudioLed_radar.png"
	  },
	  "LandmarkeDemo": {
	    location: {dir: 330},
	    img: "demosTECOIntranet/Landmarke Demo_radar.png",
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
