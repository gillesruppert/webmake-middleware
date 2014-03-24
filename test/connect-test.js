'use strict';

var connect = require('connect')
  , http = require('http')
  , normalize = require('path').normalize
  , async = require('async')

  , webmakeMw = require('../')
  , helpers = require('./helpers');

describe('connect middleware', function () {

  it('should return the compiled file when requesting a valid url ',
    function (done) {
      var path = normalize(__dirname + '/fixtures/main.js')
        , server = connect().use(webmakeMw('/test.js', path)).listen(51234,
        function (err) {
          if (err) throw err;
          http.get('http://localhost:51234/test.js',
            helpers.successResponseCallback(done, server.close.bind(server)));
        });
    });

  it('should return a 500 response when webmake has a problem with compiling' +
    ' the script', function (done) {
      var path = normalize(__dirname + '/fixtures/err.js')
        , server = connect().use(webmakeMw('/error.js', path)).listen(51234,
        function (err) {
          if (err) throw err;
          http.get('http://localhost:51234/error.js',
            helpers.failureResponseCallback(done, server.close.bind(server)));
        });
    });

  it('should be configurable with an object', function (done) {
    var config = {
      '/test1.js': normalize(__dirname + '/fixtures/main.js'),
      '/test2.js': normalize(__dirname + '/fixtures/page2.js')
    }
      , server = connect().use(webmakeMw(config)).listen(51234);

    async.parallel([
      function (cb) {
        http.get('http://localhost:51234/test1.js',
          helpers.successResponseCallback(cb));
      },
      function (cb) {
        http.get('http://localhost:51234/test2.js',
          helpers.successResponseCallback(cb));
      }], function (err) {
      if (err) throw err;
      server.close(done);
    });
  });
});
