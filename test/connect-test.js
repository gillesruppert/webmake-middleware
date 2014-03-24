var expect = require('expect.js');
var connect = require('connect');
var http = require('http');
var normalize = require('path').normalize;
var async = require('async');

var webmakeMw = require('../');
var helpers = require('./helpers');

describe('connect middleware', function() {

  it('should return the compiled file when requesting a valid url ', function(done) {
    var path = normalize(__dirname + '/fixtures/main.js');
    var server = connect().use(webmakeMw('/test.js', path)).listen(51234, function(err) {
      if (err) throw err;
      http.get('http://localhost:51234/test.js', helpers.successResponseCallback(done, server.close.bind(server)));
    });
  });

  it('should return a 500 response when webmake has a problem with compiling the script', function(done) {
    var path = normalize(__dirname + '/fixtures/err.js');
    var server = connect().use(webmakeMw('/error.js', path)).listen(51234, function(err) {
      if (err) throw err;
      http.get('http://localhost:51234/error.js', helpers.failureResponseCallback(done, server.close.bind(server)));
    });
  });

  it('should be configurable with an object', function(done){
    var config = {
      '/test1.js': normalize(__dirname + '/fixtures/main.js'),
      '/test2.js': normalize(__dirname + '/fixtures/page2.js')
    };
    var server = connect().use(webmakeMw(config)).listen(51234);

    async.parallel([
      function(cb) { http.get('http://localhost:51234/test1.js', helpers.successResponseCallback(cb)); },
      function(cb) { http.get('http://localhost:51234/test2.js', helpers.successResponseCallback(cb)); }
    ], function(err) {
      if (err) throw err;
      server.close(done);
    });
  });
});

