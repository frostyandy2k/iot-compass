var page = require('webpage').create();

page.viewportSize = {
  width: 480,
  height: 800
};

page.open('http://localhost:3000/', function() {
  page.render('capture.png');
  phantom.exit();
});

