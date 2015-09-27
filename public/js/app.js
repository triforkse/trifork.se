(function () {
  'use strict';

  var module = angular.module('triforkse', ['notify']);

  module.directive('navTopMenu', ['$window', function ($window) {
    return {
      link: function (scope, element, attrs) {

        element.addClass('top-menu--hidden');

        var targetEl = $(attrs.navTopMenu);
        if (!targetEl[0]) return;

        var wasVisibleLastTime = false;
        var initial = true;

        $window = $($window);

        var isScrolledIntoView = function () {
          var docViewTop = $window.scrollTop();
          var elemTop = targetEl.offset().top;

          return (elemTop <= docViewTop);
        };

        var checkVisibillity = function () {
          var isVisible = !isScrolledIntoView();

          if (isVisible && (initial || !wasVisibleLastTime)) {
            element.addClass('top-menu--hidden');
          }
          else if (!isVisible && (initial || wasVisibleLastTime)) {
            element.removeClass('top-menu--hidden');
          }

          wasVisibleLastTime = isVisible;
          initial = false;
        };

        // Check initial visibility
        checkVisibillity();

        $window.on('scroll', checkVisibillity);

        scope.$on('$destroy', function () {
          $window.off('scroll', checkVisibillity);
        });
      }
    };
  }]);

  module.directive('navScrollTo', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var target = $(attrs.navScrollTo);
        element.on('click', function () {
          $("body").animate({scrollTop: target.offset().top}, "slow");
        });
      }
    }
  });

  module.directive('segmentExpand', ['$window', function ($window) {

    return {
      require: 'ngModel',
      scope: {"container": "@"},
      link: function (scope, element, attrs, ctrl) {
        var expand;

        var clampToElement = function () {
          var inset = 0;
          var offset = $(element).position();
          var height = $(element).outerHeight() - inset;
          var containerHeight = $(scope.container).outerHeight();
          var margin = 60;
          var top = offset.top + margin;
          expand.css({
            top: top + inset,
            left: offset.left + inset,
            right: offset.left + inset,
            bottom: containerHeight - (top + height)
          });
        };

        element.on('mouseover', function () {
          ctrl.$setViewValue(true);
          var borderRadius = -5;
          expand.css({top: borderRadius, left: borderRadius, right: borderRadius, bottom: borderRadius});
        });

        element.on('mouseout', function () {
          ctrl.$setViewValue(false);
          clampToElement();
        });

        expand = $('<div class="segment__expand"></div>').appendTo($(element).parent());

        clampToElement();
      }
    };
  }]);


  module.directive('teamGraph', [function () {
    return {
      scope: {
        maxedOut: "="
      },
      link: function (scope, element) {

        var svg = d3.select("#frontpageTeamGraph");
        var t = 0;
        var animationDuration = 200;
        var updateInterval = 1000;

        var MAX_VAL = 500;

        var data = _(_.range(200)).map(function(i) {
          return {x: i, y: Math.floor(Math.random() * MAX_VAL)};
        }).value();

        var clamp = function (v, min, max) {
          return Math.min(Math.max(v, min), max);
        };

        var fSine = function(d, i) {
          var PI_2 = Math.PI * 2;
          var frequency = 5;
          var positionScale = i / (data.length - 1) * frequency;
          var SPEED = -0.25;

          // The value domain is 0..1 so we add 1 and divide by 2.
          var v = (Math.sin(PI_2 * positionScale + SPEED * t) + 1) / 2;

          // Scale the value to pixels.
          d.y = Math.floor(v * MAX_VAL);
        };

        var lastValue = MAX_VAL / 2;

        var fNormal = function (d, i) {
          if (i === 0) lastValue = d.y;
          lastValue = lastValue + (Math.random() * 50 - (50 / 2));
          lastValue = Math.floor(clamp(lastValue, 0, MAX_VAL));
          d.y = lastValue;
        };

        var f = fNormal;

        scope.maxedOut = function (setToMax) {
          clearInterval(timerId);
          timerId = setInterval(redraw, setToMax ? animationDuration / 2 : updateInterval);

          if (setToMax) {
            f = fSine;
          }
          else {
            f = fNormal;
          }

          redraw();
        };

        var x = d3.scale.linear()
          .domain(d3.extent(data, function (d) {
            return d.x;
          }));

        var y = d3.scale.linear()
          .domain([0, d3.max(data, function (d) {
            return d.y;
          })]);

        var h = $(element).outerHeight();

        var updateBounds = function () {
          var w = $(element).outerWidth();
          x.range([0, w]);
          y.range([h, 0]);
        };

        updateBounds();

        var areaGenerator = d3.svg.area()
          .x(function (d) {
            return x(d.x);
          })
          .y1(function (d) {
            return y(d.y);
          })
          .y0(h);

        var area = svg.append("path")
          .attr("class", "area-chart__area")
          .attr("d", areaGenerator(data));

        var valueline = d3.svg.line()
          .x(function (d) {
            return x(d.x);
          })
          .y(function (d) {
            return y(d.y);
          });

        var line = svg.append("path")
          .attr("class", "area-chart__line")
          .attr("d", valueline(data));

        var numbers = svg.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .filter(function(d) { return d.x % 5 === 0 })
          .attr("class", "area-chart__label")
          .attr("x", function(d) { return x(d.x) - 10; })
          .attr("y", function(d) { return y(d.y) - 10; })
          .text(function(d) { return d.y; });

        var redraw = function (animate) {
          if (animate === undefined) animate = true;
          var duration = animate ? animationDuration : 0;

          t = t + 1;

          _.forEach(data, f);

          area.transition()
            .duration(duration)
            .attr("d", areaGenerator(data));

          line.transition()
            .duration(duration)
            .attr("d", valueline(data));

          numbers.transition()
            .duration(duration)
            .text(function(d) { return d.y; })
            .attr("x", function(d) { return x(d.x) - 10; })
            .attr("y", function(d) { return y(d.y) - 10; })
            .attr('style', function(d) { return 'opacity:' + (d.y / MAX_VAL); })
        };

        var timerId = setInterval(redraw, updateInterval);

        $(window).on('resize', function () {
          updateBounds();
          redraw(false);
        });
      }
    };
  }]);

  module.controller('ApplicationController', ['$scope', 'notify', function ($scope, notify) {
    $scope.gotoClientWork = function () {
      notify("Our Case Studies are hosted at Trifork.com",
        "In an effort to not repeat ourselves, we host all our case studies at our global website. Visit it to read about all our happy customers.",
        [["No Thanks, Stay Here!", "stay", false], ["Visit Trifork.com", "go", true]]).then(function (notification) {
          if (notification.value === "stay") {
            notification.dismiss();
          }
          else {
            window.location.href = '//www.trifork.com/Industries';
          }
        });
    };
  }]);
}());


$(document).ready(function() {
  var container = $('#frontpageLogo');

  var ANIMATION_DURATION = 700;

  container.find('g').on('mouseover', function() {
    d3.select(this)
      .transition()
      .duration(ANIMATION_DURATION)
      .attr('transform', 'translate(0,-20)');
  });

  container.find('g').on('mouseout', function() {
    d3.select(this)
      .transition()
      .delay(ANIMATION_DURATION)
      .duration(ANIMATION_DURATION)
      .attr('transform', 'translate(0,0)');
  });

  var startAnimation = function() {
    _.forEach(container.find('g'), function(g, i) {
      d3.select(g)
        .transition()
        .delay(i * (ANIMATION_DURATION / 4))
        .duration(ANIMATION_DURATION)
        .attr('transform', 'translate(0,-8)')
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('transform', 'translate(0,0)')
    });
  };

  startAnimation();
  setInterval(startAnimation, 5000);

});

// Fonts

try { Typekit.load(); } catch (e) {}
