angular.module('content-editable', [])
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

      // options
      var opts = {};
      angular.forEach(['onlyText', 'convertNewLines'], function(opt) {
        var o = attrs[opt];
        opts[opt] = o && o !== 'false';
      });

      // when model has already a value
      $timeout(function() {
        return element.html(ngModel.$modelValue);
      });

      read = function() {
        var html;
        html = element.html();
        html = parseHtml(html);
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

      function parseHtml(html) {
        html = html.replace(/&nbsp;/g, ' ');
        if (opts.convertNewLines) {
          html = html.replace(/<br(\s*)\/*>/ig, '\r\n'); // replace br for newlines
          html = html.replace(/<[div>]+>/ig, '\r\n'); // replace div for newlines
          html = html.replace(/<\/[div>]+>/gm, '') ; // remove remaining divs
          html = html.replace(/\r\n$/, ''); // remove last newline
        }

        if (opts.onlyText) {
          html = html.replace(/<\S[^><]*>/g, '');
        }

        return html;
      }
    }
  };
});
