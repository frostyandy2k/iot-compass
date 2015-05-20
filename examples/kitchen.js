var levelup = require('level');
var db = levelup(__dirname + '/../iot.db', {valueEncoding: 'json'});

// fills DB with items and their locations(direction)
db.batch()
  .put('http://teco.kit.edu/iot/kitchen/microwave', {direction:10,slope:0,distance:0})
  .put('http://teco.kit.edu/iot/kitchen/lamp', {direction:280,slope:0,distance:0})
  .put('http://teco.kit.edu/iot/kitchen/coffee machine', {direction:170,slope:0,distance:0})
  .write(function () { console.log('Initiation complete!') });

db.put('http://teco.kit.edu/iot/kitchen/flower', 
	{direction:90,slope:0,distance:0}, function(err) {
		if(err) console.log(err);
	});