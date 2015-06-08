'use strict';

var express = require('express');
var path = require('path');
var app = express();
var config = require('./config');
var pages = require('./pages/pages');

// Template language
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Static file path
app.use(express['static'](path.join(__dirname, 'static')));

pages(app);

if (!config.PROD) {
  var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}