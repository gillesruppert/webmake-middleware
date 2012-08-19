var expect = require('expect.js');
var webmakeMw = require('../lib/webmake-middleware');

describe('webmake middleware', function() {
  describe('configuration function', function() {
    it('should be a function which takes to arguments', function() {
      expect(webmakeMw).to.be.a('function');
      expect(webmakeMw).to.have.length(2);
    });

    it('should return a middelware function which takes 3 arguments', function() {
      expect(webmakeMw({})).to.be.a('function');
      expect(webmakeMw({})).to.have.length(3);
    });

    it('should take 2 strings as arguments', function() {
      function err1() { webmakeMw() }
      function err2() { webmakeMw(1,2,3) }
      function err3() { webmakeMw(1,2) }

      expect(webmakeMw('foo', 'bar')).to.be.a('function');
      expect(err1).to.throwError();
      expect(err2).to.throwError();
      expect(err3).to.throwError();
    });

    it('should take 1 object as argument', function() {
      expect(webmakeMw({})).to.be.a('function');
    });
  });
});
