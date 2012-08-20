var expect = require('expect.js');
var express = require('express');
var http = require('http');
var normalize = require('path').normalize;
var async = require('async');

var webmakeMw = require('../lib/webmake-middleware');
var helpers = require('./helpers');

describe('express framework', function() {

  it('should return the compiled file when requesting a valid url ', function(done) {
    var path = normalize(__dirname + '/fixtures/main.js');
    var server = express().use(webmakeMw('/test.js', path)).listen(3000);

    http.get('http://localhost:3000/test.js', helpers.successResponseCallback(done, server.close.bind(server)));
  });

  it('should return a 500 response when webmake has a problem with compiling the script', function(done) {
    var path = normalize(__dirname + '/fixtures/err.js');
    var server = express().use(webmakeMw('/error.js', path)).listen(3000);

    http.get('http://localhost:3000/error.js', helpers.failureResponseCallback(done, server.close.bind(server)));
  });

  it('should be configurable with an object', function(done){
    var config = {
      '/test1.js': normalize(__dirname + '/fixtures/main.js'),
      '/test2.js': normalize(__dirname + '/fixtures/page2.js')
    };
    var server = express().use(webmakeMw(config)).listen(3000);

    async.parallel([
      function(cb) { http.get('http://localhost:3000/test1.js', helpers.successResponseCallback(cb)); },
      function(cb) { http.get('http://localhost:3000/test2.js', helpers.successResponseCallback(cb)); }
    ], function(err) {
      if (err) throw err;
      server.close();
      done();
    });
  });
});

