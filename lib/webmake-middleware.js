var webmake = require('webmake');

/**
 * configuration function
 * Takes either:
 * - 2 strings, 1 being the requested url and the other being
 *   the path to the entry file, i.e. main.js
 * or
 * - 1 object where the key is the url and the value is entry file. This is
 *   useful if you have different urls and entry points
 *
 * @param {string|object} url
 * @param {string} [file]
 * @return {function} middleware
 */
module.exports = function(url, file) {
  var l = arguments.length;
  var config;
  // configuration must be either 2 strings or 1 object
  if (!(l === 2 && typeof url === 'string' && typeof file === 'string' ||
        l === 1 && typeof url === 'object') )  throw new TypeError('wrong arguments passed');

  if (l === 2) {
    config = {};
    config[url] = file;
  }
  else if (l === 1) config = url;

  return function webmakeMiddleware(req, res, next) {
    if (! (req.url in config)) {
      next();
      return;
    }

    webmake(config[req.url], { sourceMap: true }, function(err, src) {
      if (err) {
        // fail loudly on the cli and in the browser
        console.error(err);
        res.writeHead(500);
        res.end('document.write(\'<div style="position:absolute;' +
                'top:10px;width:80%;color:red;font-size:150%;background-color:white;' +
                'border:5px solid black;padding:10px;font:sans-serif;">' +
                err.message.replace(/'/g, '\\\'') +
               '</div>\')');
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
