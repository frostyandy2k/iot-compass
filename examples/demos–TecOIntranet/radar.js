var orientationoffset = {tiltLR: 0, tiltFB: 0, dir: 0};
var currentorientation = {tiltLR: 0, tiltFB: 0, dir: 0};


function generatePattern(svgparent, size, image, id){
    svgparent.append("defs")
      .attr('aria-hidden',true)
      .append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'objectBoundingBox')
        .attr('width', size/2)
        .attr('height', size/2)
       .append("image")
        .attr("xlink:href", image)
        .attr('width', size)
        .attr('height', size);
}
function generateCircle(svgparent, radius) {
  svgparent.append("circle")
    .attr("r", radius)
    .attr('aria-hidden',true)
    .style("fill", "none")
    .style("stroke", "#ff6f00")
    .attr("class", "svgshadow");
}
function initRadar(divSelector, items) {
  $(divSelector).html('');

  var spacetime = d3.select(divSelector);

  var svgWidth = $(window).width();
  var svgHeight = $(window).height();

  var width = (svgWidth < 1000) ? svgWidth : 1000,
      height = (svgWidth < 1000) ? svgWidth : 1000,
      radius = Math.min(width, height);
      radarradius = Math.round(radius/2.5);
      itemradius = Math.round(radarradius/8);

  var svg = spacetime.append("svg")
    .attr("width", radius)
    .attr("height", radius)
    .append("g")
    .attr("transform", "translate(" + radius / 2 + "," + radius / 2 + ")");

  var w = radius/7;
  var center = svg.append("g")
      .append("svg:a")
      .attr("aria-live","polite")
      .attr("id", "radarButton")
      .attr("xlink:href", "#pagecontent")
  center.append("title").html("Nothing")
  center.append("desc").html("is in front of you.")
  center.append("svg:image")
      .attr('aria-hidden',true)
      .attr("xlink:href", "img/arrow.png")
      .attr("x", -w/2)
      .attr("y", -w/2)
      .attr("width", w)
      .attr("height", w);
  w = radius/5
  var centerimage = center.append("svg:image")
      .attr('aria-hidden',true)
      .attr("id", "radarTargetImage")
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
    .attr('aria-hidden',true)
    .attr("id", "selectionCircle")
    .style("stroke", "#ff6f00")
    .attr("fill","none");

  $.each(items, function(key, val){
    var x = -radarradius*Math.sin((val.location.dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir)*Math.PI/180);

    var color = "black";
    if(val.status != undefined && !val.status) {
      color = "red";
    }
    if(val.img) {
      generatePattern(svg, itemradius*2, val.img, key+'pattern');
      generatePattern(svg, 100, val.img, key+'patternFull');
    } else {
      var img = "img/" + key + ".png"
      generatePattern(svg, itemradius*2, img, key+'pattern');
      generatePattern(svg, 100, img, key+'patternFull');
    }
    var item = svg.append("svg:a")
      .attr("xlink:href", "#"+key)
      .append("circle")
      .attr("id", key+"radar")
      .attr("r", itemradius)
      .style("stroke-width", 3)
      .style("stroke", color)
      .attr("transform", "translate("+x+"," + y + ")")
      .attr("fill","url(#"+key+"pattern)")
    item.append("title").html(key)
    item.append("desc").html(getLocationText(key))
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

    var x = -radarradius*Math.sin(actualDirection*Math.PI/180);
    var y = -radarradius*Math.cos(actualDirection*Math.PI/180);
    var item = d3.select("#"+key+"radar")
      .attr("transform", "translate("+x+", "+y+")")

    item.select("desc").html(getLocationText(key))
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
    var dir = data.detail.orientation.dir;
    var items = data.detail.items;
    updatePositions(items, dir);
  })
  var valURIold;
  var vibrating = false;
  document.addEventListener('noItemInFront', function() {
    $('#radartarget').html("No registered things in front of you");
    vibrating = false;

    $('#mini_radar_icon').show();
    $('#mini_radar_selection').hide();
    var button = d3.select('#radarButton')
    button.attr("xlink:href", "#pagecontent")
    $('#radarTargetImage').hide();
    button.select("title").html("Nothing")
  })
  document.addEventListener('foundItemInFront', function(item) {
    item = item.detail;
    if(item.key != 'none')
    $('#radartarget').html('You are looking at the <a href="#'+item.key+'">'+ item.key + '</a>');

    $('#mini_radar_icon').hide();
    $('#mini_radar_selection').show();
    $('#mini_radar_selection').attr('src', 'img/' + item.key + '.png');
    var button = d3.select('#radarButton');
    button.attr("xlink:href", "#"+item.key)
    var centerimage = d3.select('#radarTargetImage')

    if(item.value.img) {
      centerimage.attr('xlink:href', item.value.img)
    } else {
      centerimage.attr('xlink:href', 'img/' + item.key + '.png')
    }
    $('#radarTargetImage').show();

    button.select("title").html(item.key)

    valURIold = item.key;
    if(!vibrating || (valURIold != item.key)){
      vibrating = true;
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
function getLocationText(id) {
  var location = indiana.getThingCardinalPosition(id);
  switch(location) {
    case 'N': return 'is in front of you.';
    case 'NW': return 'is in front and to the left of you.';
    case 'NE': return 'is in front and to the right of you.';
    case 'SW': return 'is behind to the left of you.';
    case 'EW': return 'is behind to the right of you.';
    case 'S': return 'is behind you.';
    case 'E': return 'is right of you.';
    case 'W': return 'is left of you.';
  }
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
});
