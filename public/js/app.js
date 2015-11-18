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
        var change = 200;

        scope.maxedOut = function (setToMax) {
          clearInterval(timerId);
          timerId = setInterval(redraw, setToMax ? 100 : 400);

          if (setToMax) {
            change = 1000;
          }
          else {
            change = 200;
          }

          redraw();
        };

        var data = [
          {text: "USD", x: 1, y: 100},
          {text: "DKK", x: 2, y: 200},
          {text: "SEK", x: 3, y: 500},
          {text: "NOK", x: 4, y: 20},
          {text: "EUR", x: 5, y: 10},
          {text: "THB", x: 6, y: 150},
          {text: "RUB", x: 7, y: 200},
          {text: "GBP", x: 8, y: 10},
          {text: "CAD", x: 9, y: 20},
          {text: "AUD", x: 10, y: 10},
          {text: "BTX", x: 11, y: 50},
          {text: "GBP", x: 12, y: 10},
          {text: "CAD", x: 13, y: 20},
          {text: "AUD", x: 14, y: 10},
          {text: "BTX", x: 15, y: 50}
        ];

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


        var clamp = function (v, min, max) {
          return Math.min(Math.max(v, min), max);
        };

        var redraw = function () {

          var MAX_VAL = 500;

          _.forEach(data, function (d) {
            var newValue = d.y + (Math.random() * change - (change / 2));
            d.y = clamp(newValue, 0, MAX_VAL);
          });

          area.transition()
            .attr("d", areaGenerator(data));

          line.transition()
            .attr("d", valueline(data));
        };

        var timerId = setInterval(redraw, 400);
        $(window).on('resize', function () {
          updateBounds();
          redraw();
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



// Fonts

try { Typekit.load(); } catch (e) {}
