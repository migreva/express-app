var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Constants
var STATIC = {
  root: './static/',
}

var cssRoot = STATIC.root + '/scss';
var cssDist = STATIC.root + '/css';
var sassFiles = cssRoot + '/**/*.scss';
var cssFiles = cssRoot + '/**/*.css';


gulp.task('sass', function () {
  gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch(sassFiles, ['sass']);
});

gulp.task('babel', function() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(babel({ stage: 0, optional: ['runtime'] }))
    .pipe(gulp.dest(dist));
});

function bundlejs(srcFile) {
  var b = browserify(srcFile, {
    debug: true,
    transform: [
      require('babelify')
    ]
  });

  gutil.log('Bundling ')

  return b
    .bundle()
    .pipe(source(srcFile))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
    .on('end', function() {
      gutil.log('Browserify finished creating: ' + distFull);
      if (typeof bcb === 'function') bcb();
    });
}