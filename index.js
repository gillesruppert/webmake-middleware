'use strict';

var validate = require('es5-ext/lib/Object/valid-value')
  , parse    = require('url').parse
  , webmake  = require('webmake');

module.exports = function (config/*, options*/) {
  var options = Object(arguments[1]);
  config = Object(validate(config));

  if (options.cache == null) options.cache = true;
  return function webmakeMiddleware(req, res, next) {
    var path = parse(req.url).pathname;
    if (config[path] == null) {
      next();
      return;
    }

    webmake(config[path], options, function (err, src) {
      if (err) {
        // fail loudly on the cli and in the browser
        console.error("Webmake error: " + err.message);
        res.writeHead(500);
        res.end('document.write(\'<div style="font-size: 1.6em;'
          + ' padding: 1em;text-align: left; font-weight: bold; color: red;'
          + ' position: absolute; top: 1em; left: 10%; width: 80%;'
          + ' background: white; background: rgba(255,255,255,0.9);'
          + ' border: 1px solid #ccc;"><div>Could not generate '
          + path + '</div><div style="font-size: 0.8em;'
          + ' padding-top: 1em">'
          + err.message.replace(/'/g, '\\\'').replace(/[\n\r]/g, '\\n')
          + '</div></div>\');');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-cache'
      });

      res.end(src);
    });
  };
};
