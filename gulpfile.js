var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

// Constants
var STATIC = {
  root: './static/',
  srcRoot: './static/src',
  distRoot: './static/dist',
}

var cssRoot = STATIC.srcRoot + '/css';
var cssDist = STATIC.distRoot + '/css';
var cssFiles = cssRoot + '/**/*.css';
