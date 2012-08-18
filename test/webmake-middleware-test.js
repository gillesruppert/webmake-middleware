var test = require('tap').test;
var webmakeMw = require('../lib/webmake-middleware');

test('configuration function', function(t) {
  t.equal(typeof webmakeMw, 'function', 'configuration function should be a function');
  t.equal(webmakeMw.length, 2, 'configuration function should take 2 arguments');
  t.end();
});

test('configuration function return value', function(t) {
  t.equal(typeof webmakeMw(), 'function', 'configuration function should return the middleware');
  t.equal(webmakeMw().length, 3, 'the middleware should take 3 arguments');
  t.end();
});
