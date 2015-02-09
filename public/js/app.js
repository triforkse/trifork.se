(function() {
    'use strict';

    var module = angular.module('triforkse', []);

    module.directive('navTopMenu', ['$window', function($window) {
        return {
            link: function(scope, element, attrs) {

                element.addClass('top-menu--hidden');

                var targetEl = $(attrs.navTopMenu);
                var wasVisibleLastTime = false;
                var initial = true;

                $window = $($window);

                var isScrolledIntoView = function() {
                    var docViewTop = $window.scrollTop();
                    var elemTop = targetEl.offset().top;

                    return (elemTop <= docViewTop);
                };

                var checkVisibillity = function() {
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

                scope.$on('$destroy', function() {
                    $window.off('scroll', checkVisibillity);
                });
            }
        };
    }]);

    module.directive('navScrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var target = $(attrs.navScrollTo);
                element.on('click', function() {
                    $("body").animate({scrollTop: target.offset().top}, "slow");
                });
            }
        }
    });
}());