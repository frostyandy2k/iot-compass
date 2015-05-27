var restify = require('restify');
var levelup = require('level');
var db = levelup(__dirname + '/iot.db', {valueEncoding: 'json'});

var server = restify.createServer({
  name: 'IoT DB',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(function(req, res, next) {
  //* allows all domains to make requests
  res.header("Access-Control-Allow-Origin", "*");
  //Allow header to specify what kind of request it was (XMLHttpRequest)
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Cache-Control"]);
  next();
}); 
// db.batch()
//   .put('microwave', '10')
//   .put('flower', '90')
//   .put('lamp', '280')
//   .put('coffee machine', '170')
//   .write(function () { console.log('Initiation complete!') });

server.get('/echo/:name', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.get('/clear', function(req, res, next) {
	db.createKeyStream()
		.on('data', function (data) {
			db.del(data, function(err){
				if(err) console.log("Deletion failed:",err);
			});
		})
		.on('error', function (err) {
			console.log('Error in reading DB:', err)
		})
		.on('close', function () {
			console.log('Stream closed!')
			res.send('Database now empty.');
		})
		.on('end', function () {
			console.log('Stream closed')
		})
});
server.get('/kitchen/put', function(req, res, next) {
	var key = req.params.uri;
	var direction = req.params.dir;
	var slope = req.params.slope;
	var distance = req.params.dist;
	var value = {direction:direction,slope:slope,distance:distance};
	console.log("PUT ", key, value);

	db.put(key, value, function(err) {
		if(err) console.log("Putting failed:",err);
		res.send("ADDED/UPDATED: "+key+"="+value);
	});
});
server.post('/kitchen/put', function(req, res, next) {
	var key = req.params.uri;
	var direction = req.params.dir;
	var slope = req.params.slope;
	var distance = req.params.dist;
	var value = {direction:direction,slope:slope,distance:distance};
	console.log("PUT ", key, value);

	db.put(key, value, function(err) {
		if(err) console.log("Putting failed:",err);
		res.send(value);
	});
});

server.get('/kitchen/delete', function(req, res, next) {
	var key = req.params.uri;
	console.log("DELETE ", key);

	db.del(key, function(err) {
		if(err) console.log("Putting failed:",err);
		res.send("DELETED: "+key);
	});
});
server.post('/kitchen/delete', function(req, res, next) {
	var key = req.params.uri;
	console.log("DELETE ", key);

	db.del(key, function(err) {
		if(err) console.log("Putting failed:",err);
		res.send("DELETED: "+key);
	});
});
// db.put('name', 'LevelUP', function (err) {
// 	if (err) return console.log('Ooops!', err) // some kind of I/O error 

// 	// 3) fetch by key 
// 	db.get('name', function (err, value) {
// 	if (err) return console.log('Ooops!', err) // likely the key was not found 

// 		// ta da! 
// 		console.log('name=' + value)
// 	})
// })
server.get('/kitchen', function(req, res, next) {
	var kitchen = [];
	console.log("GET kitchen data:");
	db.createReadStream()
		.on('data', function (data) {
			var key = data.key;
			var location = data.value;
			kitchen.push({uri:key,location:location})
			// console.log(data.key, '=', data.value)
		})
		.on('error', function (err) {
			console.log('Error reading data:', err)
		})
		.on('close', function () {
			console.log(kitchen);
			res.send(kitchen);
		})
		.on('end', function () {
			// console.log('Stream closed?')
		})
});

server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});