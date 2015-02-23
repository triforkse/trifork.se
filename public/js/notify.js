(function () {
  "use strict";

  var module = angular.module('notify', []);

  module.factory('notify', ["$q", function ($q) {
    var ANIMATION_TIME = 1000;

    return function (title, message, options) {
      return $q(function (resolve) {
        var container = angular.element('<div class="notification"><div class="notification__window"><div class="notification__title"></div><div class="notification__description"></div><div class="notification__buttons"></div></div></div>')

        var dismiss = function () {
          container.removeClass("notification--visible");
          $(document.body).removeClass("u-disable-scrolling");

          setTimeout(function () {
            container.remove();
          }, ANIMATION_TIME);
        };

        var present = function () {
          container.addClass("notification--visible");
          $(document.body).addClass("u-disable-scrolling");
        };

        var buttons = _.map(options, function (opt) {
          var text = opt[0];
          var value = opt[1];
          var cssClass = opt[2] ? "notification__button--primary" : "";

          var btn = angular.element("<button class='notification__button " + cssClass + "'>" + text + "</button>");

          btn.on("click", function () {
            resolve({value: value, dismiss: dismiss});
          });

          return btn;
        });

        container.find(".notification__title").html(title);
        container.find(".notification__description").html(message);
        container.find(".notification__buttons").append(buttons);

        document.body.appendChild(container[0]);

        // Delay adding the class so we get an animation.

        setTimeout(present, 100);
      });
    };
  }]);
}());
