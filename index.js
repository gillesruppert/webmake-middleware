'use strict';

var count    = require('es5-ext/lib/Object/count');
var validate = require('es5-ext/lib/Object/valid-value');
var parse    = require('url').parse;
var webmake  = require('webmake');
var encode   = require('entities').encodeXML;

var stringify = JSON.stringify;

module.exports = function (config/*, options*/) {
  var options = Object(arguments[1]);
  var log = (options.log == null) ? true : options.log;
  delete options.log;
  config = Object(validate(config));

  if (options.cache == null) options.cache = true;
  return function webmakeMiddleware(req, res, next) {
    var path = parse(req.url).pathname;
    var promise;
    if (config[path] == null) {
      next();
      return;
    }

    promise = webmake(config[path], options, function (err, src) {
      var msg, modulesSize, packagesSize;
      if (err) {
        // fail loudly on the cli and in the browser
        console.error("Webmake error: " + err.message);
        res.writeHead(200);
        res.end('document.write(\'<div style="font-size: 1.6em;'
          + ' padding: 1em;text-align: left; font-weight: bold; color: red;'
          + ' position: absolute; top: 1em; left: 10%; width: 80%;'
          + ' background: white; background: rgba(255,255,255,0.9);'
          + ' border: 1px solid #ccc;"><div>Could not generate '
          + path + '</div><div style="font-size: 0.8em;'
          + ' padding-top: 1em">'
          + stringify(encode(err.message)).slice(1, -1).replace(/'/g, '\\\'')
          + '</div></div>\');');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-cache'
      });

      res.end(src);
      if (log) {
        modulesSize = promise.parser.modulesFiles.length;
        packagesSize = count(promise.parser.packages);
        msg = "Webmake OK [" +  modulesSize + " module";
        if (modulesSize > 1) msg += "s";
        msg += " from " + packagesSize + " package";
        if (packagesSize > 1) msg += "s";
        console.log(msg + " in " + (promise.time / 1000).toFixed(2) + "s] -> " + req.url);
      }
    });
  };
};
