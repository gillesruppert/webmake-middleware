var expect = require('expect.js');
var connect = require('connect');
var http = require('http');
var path = require('path');
var webmakeMw = require('../lib/webmake-middleware');

describe('connect middleware', function() {

  it('should return the compiled file when requesting a valid url ', function(done) {
    var app = connect()
    .use(webmakeMw('/test.js', path.normalize(__dirname + '/fixtures/main.js')))
    .listen(3000);

    http.get('http://localhost:3000/test.js', function(res) {
      res.setEncoding('utf8');
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.be('text/javascript; charset=utf-8');
      expect(res.headers['cache-control']).to.be('no-cache');

      res.on('data', function(chunk) {
        expect(chunk).to.be.a('string');
        expect(chunk).to.not.be.empty();
      });

      res.on('close', function(err) {
        expect(false).to.be(true);
        done();
      });

      res.on('end', function() {
        app.close();
        done();
      });
    });
  });

  it('should return a 500 response when webmake has a problem with compiling the script', function(done) {
    this.timeout(0);
    var app = connect()
    .use(webmakeMw('/test2.js', path.normalize(__dirname + '/fixtures/err.js')))
    .listen(3000);

    http.get('http://localhost:3000/test2.js', function(res) {
      res.setEncoding('utf8');
      expect(res.statusCode).to.be(500);

      res.on('data', function(chunk) {
        expect(chunk).to.be.a('string');
        expect(chunk).to.contain('Cannot require');
      })
      res.on('end', done);
      app.close();
    });
  });

  it('should be configurable with an object');
});

