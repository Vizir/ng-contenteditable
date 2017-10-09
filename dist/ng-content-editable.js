(function () {

    'use strict';

    angular.module('content-editable', [])
        .directive('contenteditable', ["$timeout", function ($timeout) {
            return {
                restrict: 'A',
                require: ['^?ngModel', '^?form'],
                link: function (scope, element, attrs, args) {
                    var form;
                    var ngModel;
                    var read;
                    var validate;
                    var modelKey = getModelKey();

                    ngModel = args[0];

                    if (ngModel === null) {
                        return null;
                    }

                    form = args[1];

                    // options
                    var opts = {};
                    angular.forEach(['onlyText', 'convertNewLines', 'noLf', 'onlyNum'], function (opt) {
                        var o = attrs[opt];
                        opts[opt] = o && o !== 'false';
                    });

                    // when model has already a value
                    $timeout(function () {
                        return element.html(ngModel.$modelValue);
                    });

                    read = function () {
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

                    validate = function (content) {
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

                    ngModel.$render = function () {
                        element.html(ngModel.$viewValue || '');
                    };

                    element.bind('blur keyup change', function () {
                        scope.$apply(read);
                    });

                    element.bind('keydown', function (e) {
                        var cntrlKeys = [8, 37, 38, 39, 40, 46];
                        // comma, dot, 0-9
                        if(opts.onlyNum && cntrlKeys.indexOf(e.which) === -1 && e.which !== 188 && e.which !== 190 && !((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
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

                    return;

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
                            if (opts.noLf) {
                                var lf = ' ', rxl = / $/;
                            } else {
                                var lf = '\r\n', rxl = /\r\n$/;
                            }
                            html = html.replace(/<br(\s*)\/*>/ig, lf); // replace br for newlines
                            html = html.replace(/<[div>]+>/ig, lf); // replace div for newlines
                            html = html.replace(/<\/[div>]+>/gm, ''); // remove remaining divs
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
