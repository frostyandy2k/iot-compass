var orientationoffset = {tiltLR: 0, tiltFB: 0, dir: 0};
var currentorientation = {tiltLR: 0, tiltFB: 0, dir: 0};


function generatePattern(svgparent, size, image, id){
    svgparent.append("defs")
      .append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'objectBoundingBox')
        .attr('width', 50)
        .attr('height', 50)
       .append("image")
        .attr("xlink:href", image)
        .attr('width', size)
        .attr('height', size);
}
function generateCircle(svgparent, radius) {
  svgparent.append("circle")
    .attr("r", radius)
    .style("fill", "none")
    .style("stroke", "#ff6f00")
    .attr("class", "svgshadow");
}
function initRadar(divSelector, items) {
  $(divSelector).html('');
  var spacetime = d3.select(divSelector);

  var svgWidth = 370;
  var svgHeight = 370;

  var width = svgWidth,
      height = svgHeight,
      radius = Math.min(width, height);
      radarradius = Math.round(radius/2.5);
      itemradius = Math.round(radarradius/8);

  var svg = spacetime.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var w = width/7;
  var center = svg.append("g")
      .append("svg:a")
      .attr("id", "radarButton")
      .attr("class", "page-scroll")
      .attr("xlink:href", "#pagecontent");
  center.append("svg:image")
      .attr("xlink:href", "img/arrow.png")
      .attr("x", -w/2)
      .attr("y", -w/2)
      .attr("width", w)
      .attr("height", w);

  generateCircle(svg, radarradius);
  generateCircle(svg, radarradius*5/6);
  generateCircle(svg, radarradius*2/3);
  generateCircle(svg, radarradius/2);

  svg.append("circle")
    .attr("r", radarradius/3)
    .attr("id", "selectionCircle")
    .style("stroke", "#ff6f00")
    .attr("fill","none");

  // generatePattern(svg, 50, "img/flower.jpg", 'flowerpattern');
  // generatePattern(svg, 100, "img/flower.jpg", 'flowerpatternFull');

  // generatePattern(svg, 50, "img/microwave.png", 'microwavepattern');
  // generatePattern(svg, 100, "img/microwave.png", 'microwavepatternFull');

  // generatePattern(svg, 50, "img/lamp.png", 'lamppattern');
  // generatePattern(svg, 100, "img/lamp.png", 'lamppatternFull');

  // generatePattern(svg, 50, "img/coffeemachine.jpg", 'coffeemachinepattern');
  // generatePattern(svg, 100, "img/coffeemachine.jpg", 'coffeemachinepatternFull');

  // generatePattern(svg, 50, "img/fridge.jpg", 'fridgepattern');
  // generatePattern(svg, 100, "img/fridge.jpg", 'fridgepatternFull');

  $.each(items, function(key, val){
    if(val.img) {
      generatePattern(svg, 50, val.img, key+'pattern');
      generatePattern(svg, 100, val.img, key+'patternFull');
    } else {
      var img = "img/" + key + ".png"
      generatePattern(svg, 50, img, key+'pattern');
      generatePattern(svg, 100, img, key+'patternFull');
    }
    var x = -radarradius*Math.sin((val.location.dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir)*Math.PI/180);
    // console.log(x,y)
      // .attr("onclick", "$('#"+key+"')[0].scrollIntoView()")
      // .attr("cursor", "pointer")
    svg
      .append("svg:a")
      .attr("class", "page-scroll")
      .attr("xlink:href", "#"+key)
      .append("circle")
      .attr("id", key+"radar")
      .attr("r", itemradius)
      .attr("transform", "translate("+x+"," + y + ")")
      .style("stroke", "black")
      .attr("fill","url(#"+key+"pattern)");
  });
}
var showItems = false;

function toggleShowSelectedItem() {
  showItems = !showItems
  if(showItems) $('.br_to_lengthenpage').hide();
  else $('.br_to_lengthenpage').show();
}

function updatePositions(items, direction) {
  $.each(items, function(key, val){
    var degree = val.location.dir;
    var actualDirection = degree-direction;
    // console.log(getLocation().dir,actualDirection)
    // $('#radartarget1').html(Math.round(getLocation().dir) + " " + Math.round(actualDirection));
    var x = -radarradius*Math.sin(actualDirection*Math.PI/180);
    var y = -radarradius*Math.cos(actualDirection*Math.PI/180);
    d3.select("#"+key+"radar")
      .attr("transform", "translate("+x+", "+y+")");
  });
}

function showItem(uri) {
  $.each(items, function(key, value) {
    if(uri == 'all' || uri == key) {
      document.getElementById(key).style.display = 'block';
    } else {
      document.getElementById(key).style.display = 'none';
    }
  })
}


var indiana;

var qrcodeactive = false;
function readqrcode() {
  if(qrcodeactive) {
    indiana.deactivateQRCodeReader("#qrcodediv");
    $("#qrcodediv").hide();
    $("#radardiv").show();
  } else {
    $("#radardiv").hide();
    $("#qrcodediv").show();
    indiana.activateQRCodeReader("#qrcodediv", function(items) {
      console.log("QRCode reader -> Items", items)
      readqrcode();

      initRadar('#radardiv', items);
      initListeners();
    });
  }

  qrcodeactive = !qrcodeactive;
}

function initListeners() {
  document.addEventListener('deviceorientation2', function(data) {
    // $("#qrcodedivdata").html(Math.round(Orientation.detail.dir));
    // console.log("deviceorientation", data)
    var dir = data.detail.orientation.dir;
    var items = data.detail.items;
    updatePositions(items, dir);
  })
  var vibrating = false;
  document.addEventListener('noItemInFront', function() {
    $('#radartarget').html("none");
    $('#selectionCircle').attr("fill","none");
    vibrating = false;
    $('#mini_radar_icon').show();
    $('#mini_radar_selection').hide();
    var button = d3.select('#radarButton')
    button.attr("xlink:href", "#pagecontent")
    button.select('image')
      .attr('xlink:href', 'img/arrow.png');
 
  })
  document.addEventListener('foundItemInFront', function(item) {
    item = item.detail;
    $('#radartarget').html(item.key);

    $('#selectionCircle').attr("fill","url(#"+item.key+"patternFull)");
    $('#mini_radar_icon').hide();
    $('#mini_radar_selection').show();
    $('#mini_radar_selection').attr('src', 'img/' + item.key + '.png');
    var button = d3.select('#radarButton');
    button.attr("xlink:href", "#"+item.key)
    button.select('image')
      .attr('xlink:href', 'img/' + item.key + '.png');
 
    if(!vibrating || (valURIold != item.key)){
      valURIold = item.key;
      vibrating = true;
      navigator.vibrate(100);
    }
  })
}
function getIndianaData() {
  indiana.getRoomData(function(items) {
    console.log("getData -> Items", items)
    $("#radardiv").show();
    initRadar('#radardiv', items);
    initListeners();
    setInterval(function() {
      applyLocationTextChildren(items);
    }, 500)
  });
}
function resetIndianaOrientation() {
  indiana.resetOrientation();
}
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
// data-locationaware
// das ist nur eine beispielanwendung
function applyLocationTextChildren(registeredThings){
  $.each(registeredThings, function(key, value) {
    var location = indiana.getThingCardinalPosition(key);
    var id = '#' + key;
    console.log(location)
    // if (!$(id+"Position")) $(id).append('<p id="'+id+'Position"></p>');
    switch(location) {
      case 'N': createLocationText(id, key, 'in front'); break;
      case 'NW': createLocationText(id, key, 'in front and to the left'); break;
      case 'NE': createLocationText(id, key, 'in front and to the right'); break;
      case 'SW': createLocationText(id, key, 'behind to the left'); break;
      case 'EW': createLocationText(id, key, 'behind to the right'); break;
      case 'S': createLocationText(id, key, 'behind', true); break;
      case 'E': createLocationText(id, key, 'right'); break;
      case 'W': createLocationText(id, key, 'left'); break;
    }
  })
}

function createLocationText(id, thing, location, no_of){
    var of = no_of ? '' : ' of';
    $(id+"Position").html("<strong>The "+thing+" is "+location+of+" you.</strong>");
}

$(document).ready(function() {
  $("#radardiv").hide();
  $("#qrcodediv").hide();
  indiana = spatialAwareness();
  getIndianaData();
  // initDeviceMotion();
    // if(hasGetUserMedia()) readqrcode();
    // else console.log("Browser doesn't support video capture.")
});
function initDeviceMotion() {

  // Position Variables
  var x = 0;
  var y = 0;
  var z = 0;
  // Speed - Velocity
  var vx = 0;
  var vy = 0;
  var vz = 0;
   
  // Acceleration
  var ax = 0;
  var ay = 0;
  var az = 0;
   
  var delay = 10;
  var vMultiplier = delay/1000;
  window.ondevicemotion = function(data) {
    // $("#qrcodedivdata").html(Math.round(Orientation.detail.dir));
    // console.log("deviceorientation", data)
    var accel2 = data.accelerationIncludingGravity;
    var accel = data.acceleration;
    // console.log('accel gravity:',accel)
    // console.log('accel:',accel2)
    ax = Math.round(accel.x*precision)/precision;
    ay = Math.round(accel.y*precision)/precision;
    az = Math.round(accel.z*precision)/precision;
  }
  
  var epsilon = 0.0001;
  var precision_digits = 6;
  var precision = 10^(precision_digits);
  setInterval(function() {
    $('#qrcodedivdata').html('accel x: ' + ax.toFixed(precision_digits) 
      + '\ny: ' + ay.toFixed(precision_digits) + '\nz: ' + az.toFixed(precision_digits));
    vy = vy + ay*vMultiplier;
    vx = vx + ax*vMultiplier;
    vz = vz + az*vMultiplier;
 

    // var ball = document.getElementById("ball");
    // if(Math.abs(ay) > epsilon) 
    y = (y + vx*vMultiplier + ay/2 * vMultiplier*vMultiplier);
    y = Math.round(y*precision)/precision;
    // if(Math.abs(ax) > epsilon) 
    x = (x + vy*vMultiplier + ax/2 * vMultiplier*vMultiplier);
    x = Math.round(x*precision)/precision;
    // if(Math.abs(az) > epsilon) 
    z = (z + vz*vMultiplier + az/2 * vMultiplier*vMultiplier);
    z = Math.round(z*precision)/precision;
    $('#qrcodediverr').html('pos x: ' + x.toFixed(precision_digits) 
      + '\ny: ' + y.toFixed(precision_digits) + '\nz: ' + z.toFixed(precision_digits));
    // if (x<0) { x = 0; vx = 0; }
    // if (y<0) { y = 0; vy = 0; }
    // if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = 0; }
    // if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = 0; }
    
    // ball.style.top = y + "px";
    // ball.style.left = x + "px";
    // document.getElementById("pos").innerHTML = "x=" + x + "<br />y=" + y;
  }, delay);
}