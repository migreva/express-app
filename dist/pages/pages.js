'use strict';

var _ = require('lodash');
var index = require('./index');

var pages = [index];

module.exports = function (app) {
  _.forEach(pages, function (page) {
    page(app);
  });

  return {};
};