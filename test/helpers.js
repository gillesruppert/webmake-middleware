var expect = require('expect.js');

exports.successResponseCallback = function successResponseCallback(cb, close) {
  return function testSuccessResp(res) {
    res.setEncoding('utf8');
    expect(res.statusCode).to.be(200);
    expect(res.headers['content-type']).to.be('text/javascript; charset=utf-8');
    expect(res.headers['cache-control']).to.be('no-cache');

    res.on('data', function(chunk) {
      expect(chunk).to.be.a('string');
      expect(chunk).to.not.be.empty();
    });

    res.on('close', cb);
    res.on('end', function() {
      if (close) close();
      cb();
    });
  }
};

exports.failureResponseCallback = function failureResponseCallback(cb, close) {
  return function testFailureResp(res) {
    res.setEncoding('utf8');
    expect(res.statusCode).to.be(500);

    res.on('data', function(chunk) {
      expect(chunk).to.be.a('string');
      expect(chunk).to.contain('Cannot require');
    });

    res.on('close', cb);
    res.on('end', function() {
      if (close) close();
      cb();
    });
  }
};
