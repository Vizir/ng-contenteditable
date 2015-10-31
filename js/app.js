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
              form.message.$setValidity('message', false);
              return element.addClass('-error');
            }
            if (element.hasClass('-error')) {
              form.message.$setValidity('message', true);
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
