var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

// Postcss
var postcss = require('gulp-postcss');
var cssnext = require('gulp-cssnext');
var atImport = require('postcss-import');

// Constants
var STATIC = {
  root: './static/',
  srcRoot: './static/src',
  distRoot: './static/dist',
}

var cssRoot = STATIC.srcRoot + '/css';
var cssDist = STATIC.distRoot + '/css';
var cssFiles = cssRoot + '/**/*.css';

gulp.task('css', function() {

  var processors = [
    cssnext
  ];

  return gulp.src(cssFiles)
          .pipe(cssnext({
            compress: true,
          }))
          .pipe(gulp.dest(cssDist));
});

gulp.task('watch', function() {

  watch(cssFiles, batch(function() {
    gulp.start('css')
      .pipe(watch(cssFiles));
  }));
});