$(document).ready(function() {
  var balloon = $('#balloon');
  balloon.css({position: "absolute", left: 300, top: 150, cursor: 'pointer'});

  var NORMAL_SPEED = 12;
  var FAST_SPEED = 50;
  var SPEED = NORMAL_SPEED;
  var ROTATION = 0;

  var NORMAL_WIND = 10;
  var FAST_WIND = 100;
  var WIND = NORMAL_WIND;

  var cancel = null;

  function update() {
    var p = balloon.position();

    balloon.css('left', p.left + (Math.random() - 0.5) * SPEED + WIND);
    balloon.css('top', p.top + (Math.random() - 0.5) * SPEED);
    balloon.css('transform', 'rotate(' + ROTATION + 'deg)');
  }

  function restart() {
    if (cancel) clearInterval(cancel);
    cancel = setInterval(update, 100);
    update();
  }

  function setSpeed(speed, wind, rotation) {
    SPEED = speed;
    WIND = wind;
    ROTATION = rotation;
    restart();
  }

  balloon.on('click touchstart', function() {
    setSpeed(FAST_SPEED, FAST_WIND, 10);
    setTimeout(function() { setSpeed(NORMAL_SPEED, NORMAL_WIND, 0); }, 2000);
  });

  restart();
});
