/*!
 * angular-spectrum-colorpicker v1.3.5
 * https://github.com/Jimdo/angular-spectrum-colorpicker
 *
 * Angular directive for a colorpicker, that bases on http://bgrins.github.io/spectrum/
 * Idea from http://jsfiddle.net/g/LAJCa/
 *
 * Copyright 2015, Jimdo GmbH
 * Released under the MIT license
 */
(function(angular, undefined) {
  'use strict';

  // src/js/helper.module.js
  var angularSpectrumColorpicker = angular.module('angularSpectrumColorpicker', []);

  // src/js/spectrumColorpicker.directive.js
  (function(undefined) {
    'use strict';
    angularSpectrumColorpicker.directive('spectrumColorpicker', function() {
      return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
          fallbackValue: '=',
          disabled: '=?',
          format: '=?',
          options: '=?',
          triggerId: '@?',
  
          onChange: '&?',
          onShow: '&?',
          onHide: '&?',
          onMove: '&?',
  
          onBeforeShow: '&?',
        },
        replace: true,
        templateUrl: 'directive.html',
        link: function($scope, $element, attrs, $ngModel) {
  
          var $input = $element.find('input');
  
          function formatColor(tiny) {
            var formatted = tiny;
            if (formatted) {
              formatted = tiny.toString($scope.format);
            }
            return formatted;
          }
  
          function callOnChange(color) {
            if (angular.isFunction($scope.onChange)) {
              $scope.onChange({color: color});
            }
          }
  
          function setViewValue(color) {
            var value = $scope.fallbackValue;
  
            if (color) {
              value = formatColor(color);
            } else if (angular.isUndefined($scope.fallbackValue)) {
              value = color;
            }
  
            $ngModel.$setViewValue(value);
            callOnChange(value);
          }
  
          var onChange = function(color) {
            $scope.$apply(function() {
              setViewValue(color);
            });
          };
          var onToggle = function() {
            $input.spectrum('toggle');
            return false;
          };
  
  
          var baseOpts = {
            color: $ngModel.$viewValue
          };
  
          var localOpts = {};
  
          angular.forEach({
            'change': 'onChange',
            'move': 'onMove',
            'hide': 'onHide',
            'show': 'onShow'
          }, function(eventKey, spectrumOptionName) {
            localOpts[spectrumOptionName] = function(color) {
              onChange(color);
              // we don't do this for change, because we expose the current
              // value actively through the model
              if (eventKey !== 'change' && angular.isFunction($scope[eventKey])) {
                return $scope[eventKey]({color: formatColor(color)});
              }
            };
          });
  
          if (angular.isFunction($scope.onBeforeShow)) {
            localOpts.beforeShow = function(color) {
              return $scope.onBeforeShow({color: formatColor(color)});
            };
          }
  
          var options = angular.extend({}, baseOpts, $scope.options, localOpts);
  
          if ($scope.triggerId) {
            angular.element(document.body).on('click', '#' + $scope.triggerId, onToggle);
          }
  
          $ngModel.$render = function() {
            $input.spectrum('set', $ngModel.$viewValue || '');
            callOnChange($ngModel.$viewValue);
          };
  
          if (options.color) {
            $input.spectrum('set', options.color || '');
            setViewValue(options.color);
          }
  
          $input.spectrum(options);
  
          $scope.$on('$destroy', function() {
            if ($scope.triggerId) {
              angular.element(document.body).off('click', '#' + $scope.triggerId, onToggle);
            }
            $input.spectrum('destroy');
          });
  
          if(angular.isDefined(options.disabled)) {
            $scope.disabled = !!options.disabled;
          }
  
          $scope.$watch('disabled', function (newDisabled) {
            $input.spectrum(newDisabled ? 'disable' : 'enable');
          });
        }
      };
    });
  })();

  // .tmp/all-partials.js
  angular.module('angularSpectrumColorpicker').run(['$templateCache', function($templateCache) {
    'use strict';
  
    $templateCache.put('directive.html',
      "<span><input class=input-small></span>"
    );
  
  }]);
})(window.angular);
