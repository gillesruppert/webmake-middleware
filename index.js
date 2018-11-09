"use strict";

const count    = require("es5-ext/object/count");
const validate = require("es5-ext/object/valid-value");
const parse    = require("url").parse;
const webmake  = require("webmake");
const encode   = require("entities").encodeXML;
const errorTpl = require("fs").readFileSync(`${ __dirname }/error-template.js`, "utf8");

const stringify = JSON.stringify;

module.exports = function (config/* , options*/) {
  const options = Object(arguments[1]);
  const log = (options.log == null) ? true : options.log;
  delete options.log;
  config = Object(validate(config));

  if (options.cache == null) options.cache = true;
  return function webmakeMiddleware(req, res, next) {
    const path = parse(req.url).pathname;
    let promise;
    if (config[path] == null) {
      next();
      return;
    }

    promise = webmake(config[path], options, (err, src) => {
      let msg, modulesSize, packagesSize;

      res.writeHead(200, {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "no-cache"
      });

      if (err) {
        // fail loudly on the cli and in the browser
        console.error(`Webmake error: ${ err.message }`);
        res.end(errorTpl.replace("$PATH", stringify(encode(path)).slice(1, -1))
          .replace("$ERROR", stringify(encode(err.message)).slice(1, -1)));
        return;
      }

      res.end(src);
      if (log) {
        modulesSize = promise.parser.modulesFiles.length;
        packagesSize = count(promise.parser.packages);
        msg = `Webmake OK [${ modulesSize } module`;
        if (modulesSize > 1) msg += "s";
        msg += ` from ${ packagesSize } package`;
        if (packagesSize > 1) msg += "s";
        console.log(`${ msg } in ${ (promise.time / 1000).toFixed(2) }s] -> ${
          req.url }`);
      }
    });
  };
};
