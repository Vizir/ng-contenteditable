var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs())
    .pipe(jscs.reporter())
});

gulp.task('compile', function() {
  return gulp.src('src/**/*.js')
    .pipe(ngAnnotate())
    .pipe(concat('ng-content-editable.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('ng-content-editable.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function() {
  gulp.watch('src/**/*.js', ['lint', 'compile']);
});

gulp.task('default', ['lint', 'compile']);
