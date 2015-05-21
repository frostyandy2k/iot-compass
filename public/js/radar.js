var orientationoffset = {tiltLR: 0, tiltFB: 0, dir: 0};
var currentorientation = {tiltLR: 0, tiltFB: 0, dir: 0};

var items = [
  {uri: "microwave",
    location: {dir: 10},
    color: "blue"},
  {uri: "flower",
    location: {dir: 90},
    color: "red"},
  {uri: "lamp",
    location: {dir: -90},
    color: "white"}
];

function initRadar(divSelector) {
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
  var h = height/7;
  var center = svg.append("g")
      .append("svg:a")
      .attr("id", "radarButton")
      .attr("class", "page-scroll")
      .attr("xlink:href", "#pagecontent");
  center.append("svg:image")
      .attr("xlink:href", "img/arrow.png")
      .attr("x", -w/2)
      .attr("y", -h/2)
      .attr("width", w)
      .attr("height", h);

  svg.append("circle")
    .attr("r", radarradius)
    .style("fill", "none")
    .style("stroke", "rgba(0, 0, 0, 1)");

  $.each(items, function(key, val){
    var x = radarradius*Math.sin((val.location.dir-getLocation().dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir-getLocation().dir)*Math.PI/180);
    // console.log(x,y)
    svg.append("circle")
      .attr("class", "items " + val.uri)
      .attr("r", itemradius)
      .attr("transform", "translate("+x+"," + y + ")")
      .style("stroke", "black")
      .style("fill", val.color);
  });
}

function updatePositions() {
  var radartarget = null;
  var guard = false;
  $.each(items, function(key, val){
    var degree = val.location.dir;
    var actualDirection = degree+getLocation().dir;
    // console.log(getLocation().dir,actualDirection)
    // $('#radartarget1').html(Math.round(getLocation().dir) + " " + Math.round(actualDirection));
    if(actualDirection < 5 && actualDirection > -5) {
        radartarget = val.uri;
        // console.log(radartarget)
        // $('#radartarget').html(radartarget);
        // console.log($('#radarButton').find('image'))
        $('#radarButton').find('image').attr('href', 'img/' + val.uri + '.png');
        navigator.vibrate(10);
        guard = true;
    } else if(!guard){
      // $('#radartarget').html('none');
      $('#radarButton').find('image').attr('href', 'img/arrow.png');
      guard = false;
    }
    var x = radarradius*Math.sin(actualDirection*Math.PI/180);
    var y = -radarradius*Math.cos(actualDirection*Math.PI/180);
    d3.select("."+val.uri)
      .attr("transform", "translate("+x+", "+y+")");
  });
}

function getLocation() {
  var location = {};
  location.dir = currentorientation.dir - orientationoffset.dir;
  return location;
}

function turnDirection() {
  currentorientation.dir += 10;
  if(currentorientation.dir > 180) 
      currentorientation.dir = currentorientation.dir-360;
  updatePositions();
}
function resetOrientation() {
  orientationoffset.tiltLR = currentorientation.tiltLR;
  orientationoffset.tiltFB = currentorientation.tiltFB;
  orientationoffset.dir = currentorientation.dir;
}

function init() {
  if (window.DeviceOrientationEvent) {
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      // gamma is the left-to-right tilt in degrees, where right is positive
      var tiltLR = eventData.gamma;
      
      // beta is the front-to-back tilt in degrees, where front is positive
      var tiltFB = eventData.beta;
      
      // alpha is the compass direction the device is facing in degrees
      var dir = eventData.alpha;
      
      currentorientation.tiltLR = tiltLR;
      currentorientation.tiltFB = tiltFB;
      currentorientation.dir = (dir<0) ? 360+dir : dir;

      // call our orientation event handler
      if(dir < orientationoffset.dir) {
        dir = 360 - (orientationoffset.dir - dir);
      } else {
        dir = dir - orientationoffset.dir;
      }
      updatePositions();
      }, false);
  } else {
    console.log("Device orientation is not supported on your device or browser.");
  }
}
