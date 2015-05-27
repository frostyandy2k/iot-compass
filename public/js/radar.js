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

  generatePattern(svg, 50, "img/flower.jpg", 'flowerpattern');
  generatePattern(svg, 100, "img/flower.jpg", 'flowerpatternFull');

  generatePattern(svg, 50, "img/microwave.png", 'microwavepattern');
  generatePattern(svg, 100, "img/microwave.png", 'microwavepatternFull');

  generatePattern(svg, 50, "img/lamp.png", 'lamppattern');
  generatePattern(svg, 100, "img/lamp.png", 'lamppatternFull');

  generatePattern(svg, 50, "img/coffeemachine.jpg", 'coffeemachinepattern');
  generatePattern(svg, 100, "img/coffeemachine.jpg", 'coffeemachinepatternFull');

  generatePattern(svg, 50, "img/fridge.jpg", 'fridgepattern');
  generatePattern(svg, 100, "img/fridge.jpg", 'fridgepatternFull');


  $.each(items, function(key, val){
    var x = -radarradius*Math.sin((val.location.dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir)*Math.PI/180);
    // console.log(x,y)
    svg.append("circle")
      .attr("class", "items " + val.uri)
      .attr("r", itemradius)
      .attr("transform", "translate("+x+"," + y + ")")
      .style("stroke", "black")
      .attr("fill","url(#"+val.uri+"pattern)");
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
    d3.select("."+val.uri)
      .attr("transform", "translate("+x+", "+y+")");
  });
}

function showItem(uri) {
  $.each(items, function(key, value) {
    if(uri == 'all' || uri == value.uri) {
      document.getElementById(value.uri).style.display = 'block';
    } else {
      document.getElementById(value.uri).style.display = 'none';
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
  })
  document.addEventListener('foundItemInFront', function(item) {
    item = item.detail;
    $('#radartarget').html(item.uri);

    $('#selectionCircle').attr("fill","url(#"+item.uri+"patternFull)");
    $('#mini_radar_icon').hide();
    $('#mini_radar_selection').show();
    $('#mini_radar_selection').attr('src', 'img/' + item.uri + '.png');
 
    if(!vibrating || (valURIold != val.uri)){
      valURIold = val.uri;
      vibrating = true;
      navigator.vibrate(100);
    }
  })
}
function getIndianaData() {
  indiana.getData(function(items) {
    console.log("getData -> Items", items)
    $("#radardiv").show();
    initRadar('#radardiv', items);
    initListeners();
  });
}
function resetIndianaOrientation() {
  indiana.resetOrientation();
}
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
$(document).ready(function() {
    indiana = spatialAwareness();
    $("#radardiv").hide();
    $("#qrcodediv").hide();

    // if(hasGetUserMedia()) readqrcode();
    // else console.log("Browser doesn't support video capture.")
});
