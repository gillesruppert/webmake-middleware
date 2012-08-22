Webmake middleware for express and connect
==========================================

This module is a simple helper to make development with [webmake][1] straight-forward to set up. Webmake is a lightweight client-side dependency management tool that allows you to use node modules in the browser. You can read up on it [here][1].

This module is a simple middleware for [connect][2] and its cousin [express][3].

## To install

    npm install webmake-middleware

## Usage

If you are already using `express` or `connect` for your app, simply configure your server to use the middleware. Since this middleware is currently only for use during development, make sure you put it into the `development` configuration of your `express` application! In the future, there is a good chance that it can be configured to be used for production as well so that it doesn't re-compile the scripts on each request and that the cache headers are configurable.

```javascript
var connect = require('connect'); // this could also be express
var webmakeMiddleware = require('webmake-middleware');

// the `/build.js` url is the request url. `/path/to/main.js` is the path to the
// main entry point.
var server = connect().use(webmakeMiddleware('/build.js', '/path/to/main.js'));
// add other middleware as necessary

server.listen(3000);
```

If your app only every uses 1 script, the 1st argument is the url to the script and the 2nd argument the absolute path to the entry point of your app, i.e. `main.js`.

If your app uses multiple scripts, i.e. for different pages, you can pass an `object` where the key is the `url` and the value is the `path`.

```javascript
webmakeMiddleware({
  '/core.js': '/absolute/path/to/main.js',
  '/page2.js': '/absolute/path/to/page2main.js'
})
```

**N.B: the path to the file needs to be absolute so you will have to construct it with `path.normalize(__dirname + '/path/to/main.js')` or similar**

## Tests

    # in the webmake-middleware directory
    npm install
    npm test



[1]: http://github.com/medikoo/modules-webmake
[2]: http://www.senchalabs.org/connect/
[3]: http://expressjs.com
