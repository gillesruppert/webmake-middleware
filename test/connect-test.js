"use strict";

const connect = require("connect");
const http = require("http");
const normalize = require("path").normalize;
const async = require("async");

const webmakeMw = require("../");
const helpers = require("./helpers");

describe("connect middleware", () => {

  it("should return the compiled file when requesting a valid url ",
    done => {
      var path = normalize(`${ __dirname }/fixtures/main.js`)
        , server = connect().use(webmakeMw({ "/test.js": path })).listen(51234,
        err => {
          if (err) throw err;
          http.get("http://localhost:51234/test.js",
            helpers.successResponseCallback(done, server.close.bind(server)));
        });
    });

  it("should return a 500 response when webmake has a problem with compiling" +
    " the script", done => {
      var path = normalize(`${ __dirname }/fixtures/err.js`)
        , server = connect().use(webmakeMw({ "/error.js": path })).listen(51234,
        err => {
          if (err) throw err;
          http.get("http://localhost:51234/error.js",
            helpers.failureResponseCallback(done, server.close.bind(server)));
        });
    });

  it("should be configurable with an object", done => {
    let config = {
      "/test1.js": normalize(`${ __dirname }/fixtures/main.js`),
      "/test2.js": normalize(`${ __dirname }/fixtures/page2.js`)
    }
      , server = connect().use(webmakeMw(config)).listen(51234);

    async.parallel([
      function (cb) {
        http.get("http://localhost:51234/test1.js",
          helpers.successResponseCallback(cb));
      },
      function (cb) {
        http.get("http://localhost:51234/test2.js",
          helpers.successResponseCallback(cb));
      }], err => {
      if (err) throw err;
      server.close(done);
    });
  });
});
