/*global angular*/

(function () {
  'use strict';

  var demoApp = angular.module("demo", [])
    .directive('contenteditable', function($timeout) {
      return {
        restrict: 'A',
        require: ['^?ngModel', '^?form'],
        link: function(scope, element, attrs, args) {
          var form, ngModel, read, validate;
          // get the modelKey to update form field validity
          var split = attrs.ngModel.split('.');
          var modelKey = split[split.length - 1];

          ngModel = args[0];
          form = args[1];
          // when model has already a value
          $timeout(function() {
            return element.html(ngModel.$modelValue);
          });

          read = function() {
            var html;
            html = element.html();
            html = html.replace(/&nbsp;/g, ' ');
            ngModel.$setViewValue(html);
            validate(html);
          };

          validate = function(html) {
            var length = html.length;
            if (length > attrs.ngMaxlength || length < attrs.ngMinlength) {
              ngModel.$setValidity(modelKey, false);
              return element.addClass('-error');
            }
            if (element.hasClass('-error')) {
              ngModel.$setValidity(modelKey, true);
              return element.removeClass('-error');
            }
          };

          element.bind('blur keyup change', function() {
            scope.$apply(read);
          });

          return;
        }
      };
    });
}());
