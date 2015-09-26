$(document).ready(function() {
  var balloon = $('#balloon');
  balloon.css({position: "absolute", left: 300, top: 150});

  var SPEED = 12;
  var direction = 1;

  setInterval(function() {

    var p = balloon.position();

    balloon.css('left', p.left + (Math.random() - 0.5) * SPEED * direction + 10);
    balloon.css('top', p.top + (Math.random() - 0.5) * SPEED * direction);
  }, 1000);
});
