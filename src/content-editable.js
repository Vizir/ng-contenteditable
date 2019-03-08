(function () {

    'use strict';

    angular.module('content-editable', [])
        .directive('contenteditable', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                require: ['^?ngModel', '^?form'],
                link: function (scope, element, attrs, args) {
                    var ngModel = args[0],
                        modelKey = getModelKey();

                    if (ngModel === null) {
                        return null;
                    }

                    // options
                    var opts = {};
                    angular.forEach(['onlyText', 'convertNewLines', 'noLf', 'onlyNum'], function (opt) {
                        opts[opt] = attrs[opt] && attrs[opt] !== 'false';
                    });

                    // when model has already a value
                    $timeout(function () {
                        return element.html(ngModel.$modelValue);
                    });

                    var validate = function (content) {
                        var length = content.length;

                        if (length > attrs.ngMaxlength || length < attrs.ngMinlength) {
                            ngModel.$setValidity(modelKey, false);
                            return element.addClass('-error');
                        }

                        if (element.hasClass('-error')) {
                            ngModel.$setValidity(modelKey, true);
                            return element.removeClass('-error');
                        }
                    };

                    var read = function () {
                        var content;
                        if ((opts.onlyText && opts.noLf) || opts.onlyNum) {

                            content = element.text();

                        } else {
                            content = element.html();
                            if (content) {
                                content = parseHtml(content);
                            }
                        }

                        ngModel.$setViewValue(content);
                        validate(content);
                    };

                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || '');
                    };

                    element.bind('blur keyup change', function () {
                        scope.$apply(read);
                    });

                    element.bind('keydown', function (e) {
                        var cntrlKeys = [8, 37, 38, 39, 40, 46];
                        // comma, dot, 0-9
                        if (opts.onlyNum && cntrlKeys.indexOf(e.which) === -1 && e.which !== 188 && e.which !== 190 && !((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
                            e.preventDefault();
                            return false;
                        }
                        if (opts.noLf) {
                            if (e.which === 13) {
                                e.preventDefault();
                                return false;
                            } else if (attrs.ngMaxlength && element.text().length >= attrs.ngMaxlength && cntrlKeys.indexOf(e.which) === -1) {
                                // !e.shiftKey && !e.altKey && !e.ctrlKey &&
                                e.preventDefault();
                                return false;
                            }
                        }
                    });

                    function getModelKey() {
                        if (typeof attrs.ngModel === 'undefined') {
                            return null;
                        }

                        var split = attrs.ngModel.split('.');

                        return split[split.length - 1];
                    }

                    function parseHtml(html) {
                        html = html.replace(/&nbsp;/g, ' ');

                        if (opts.convertNewLines || opts.noLf) {
                            var lf = '\r\n',
                                rxl = /\r\n$/;

                            if (opts.noLf) {
                                lf = ' ';
                                rxl = / $/;
                            }

                            html = html.replace(/<br(\s*)\/*>/ig, lf); // replace br for newlines
                            html = html.replace(/<[div>]+>/ig, lf); // replace div for newlines
                            html = html.replace(/<\/[div>]+>/gm, ''); // remove remaining divs
                            html = html.replace(/<[p>]+>/ig, lf); // replace p for newlines
                            html = html.replace(/<\/[p>]+>/gm, ''); // remove remaining p
                            html = html.replace(rxl, ''); // remove last newline
                        }

                        if (opts.onlyText) {
                            html = html.replace(/<\S[^><]*>/g, '');
                        }

                        return html;
                    }
                }
            };
        }]);
})();
