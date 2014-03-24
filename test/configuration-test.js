'use strict';

var expect = require('expect.js'), webmakeMw = require('../');

describe('webmake middleware', function () {
  describe('configuration function', function () {
    it('should be a function which takes to arguments', function () {
      expect(webmakeMw).to.be.a('function');
      expect(webmakeMw).to.have.length(1);
    });

    it('should return a middelware function which takes 3 arguments',
      function () {
        expect(webmakeMw({})).to.be.a('function');
        expect(webmakeMw({})).to.have.length(3);
      });

    it('should take 1 object as argument', function () {
      function err1() { webmakeMw(); }
      expect(err1).to.throwError();
      expect(webmakeMw({})).to.be.a('function');
    });
  });
});
