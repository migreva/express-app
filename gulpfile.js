var fs = require('fs');

var each = require('lodash/collection/forEach');

var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var tap = require('gulp-tap');
var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');
var pkgify = require('pkgify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var bourbon = require('node-bourbon');


// Postcss
var postcss = require('gulp-postcss');

// Constants
var STATIC = {
  root: './static/',
  srcRoot: './static/src/',
  distRoot: './static/dist/',
}

// CSS File paths
var cssRoot = STATIC.srcRoot + 'css/';
var cssDist = STATIC.distRoot + 'css/';
var sassFiles = cssRoot + '**/*.scss';

// JS File paths
var jsRoot = STATIC.srcRoot + 'js/';
var jsDist = STATIC.distRoot + 'js';
var jsFiles = jsRoot + '**/*.js';
var jsBundle = ['blog/index.js', 'lib/subpage.js', 'projects/projects.js'];

gulp.task('sass', function () {
  var paths = ['./node_modules/', './static/fonts'];
  paths = paths.concat(bourbon.includePaths);

  gulp.src(sassFiles)
    .pipe(sass({
      includePaths: paths
    })
    .on('error', sass.logError))
    .pipe(gulp.dest(cssDist));
});

gulp.task('browserify', function(cb) {
  var bcb = (function() {
    var counter = 0;
    return function() {
      counter++;
      if (counter == jsBundle.length) return cb();
    };
  })();

  each(jsBundle, function(fname) {
    var filePath = jsRoot + fname;
    var fileDest = fname.split('/').length > 1 ? fname.split('/').slice(0, -1).join('/') : '';
    fileDest = jsDist + '/' + fileDest;
    gulp.src(filePath)
        .pipe(plumber(gutil.log))
        .pipe(tap(bundleJs))
        .pipe(gulp.dest(fileDest))
        .on('end', function() {
          gutil.log('Browserify finished creating: ' + fileDest);
          // if (typeof bcb === 'function') bcb();
        });
  });
});

gulp.task('babel', function() {
  babelBundle();
});

function bundlejs(file) {
  var b = browserify(jsRoot + '/' + file, {
    shim: {
      jQuery: {
          path: 'public/js/jquery.min.js',
          exports: '$'
      }
    }
  });

  return b.bundle()
          .pipe(source(file))
          .pipe(buffer())
          .pipe(sourcemaps.init())
            // .pipe(uglify())
            // .on('error', gutil.log)
          .pipe(sourcemaps.write('./', {
            // includeContent: true,
            sourceRoot: '/src',
            sourceMappingURLPrefix: '/dist/js/'

          }))
          .pipe(gulp.dest(jsDist));
}

// This gulp task now restarts after each JS error yaaaaay
gulp.task('watch', function() {

  // https://gist.github.com/RnbWd/2456ef5ce71a106addee
  gutil.log('Watching JS files ...');
  gulp.watch(jsFiles, function() {
    each(jsBundle, function(fname) {
      var filePath = jsRoot + fname;
      var fileDest = fname.split('/').length > 1 ? fname.split('/').slice(0, -1).join('/') : '';
      fileDest = jsDist + '/' + fileDest;
      gutil.log('Compiling ' + filePath + ' ...');
      gulp.src(filePath)
          .pipe(plumber(gutil.log))
          .pipe(tap(bundleJs))
          .pipe(gulp.dest(fileDest))
          .on('end', function() {
            gutil.log('Browserify finished creating: ' + fileDest);
            // if (typeof bcb === 'function') bcb();
          });
    });
  })

  gutil.log('Watching node modules ...');
  gulp.watch('./src/**/*.js', ['babel']);

  gulp.watch(sassFiles, ['sass']);
});

gulp.task('default', ['babel', 'browserify', 'sass']);


// https://gist.github.com/RnbWd/2456ef5ce71a106addee
function bundleJs(file, bcb) {

  if (!fs.existsSync(file.path)) {
    gutil.log('Could not find ' + file.path + ', ignoring')
    return;
  }

  gutil.log('Browserify is compiling ' + file.path);
  var b = browserify(file.path, {
      debug: true,
      fullPaths: true,
    })
    .transform(babelify.configure({ stage: 0, optional: ['runtime'] }))
    // .transform(pkgify, {
    //   packages: {
    //     components: './static/js/src/components',
    //     framework: './static/js/src/framework',
    //   },
    //   relative: __dirname
    // })
    .transform(reactify)

  // Do the necessary thing for tap/plumber
  var stream = b.bundle();
  file.contents = stream;

  // Source map
  // stream
  //   .pipe(source(file.path))
  //   .pipe(buffer())
  //   // .pipe(sourcemaps.init({loadMaps: true}))
  //     .on('error', gutil.log)
  //   //  .pipe(uglify())
  //   // .pipe(sourcemaps.write('./'))
  //   .pipe(gulp.dest(jsDist));
}

function babelBundle() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(plumber(gutil.log))
    .pipe(babel({ stage: 0, optional: ['runtime'] }))
    .pipe(gulp.dest(dist))
    .on('end', function() {
      gutil.log('Done babelifying');
    });
}
