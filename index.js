"use strict";

const count     = require("es5-ext/object/count")
    , isValue   = require("es5-ext/object/is-value")
    , validate  = require("es5-ext/object/valid-value")
    , { parse } = require("url")
    , webmake   = require("webmake")
    , encode    = require("entities").encodeXML
    , errorTpl  = require("fs").readFileSync(`${ __dirname }/error-template.js`, "utf8");

const { stringify } = JSON;

module.exports = function (config, options = {}) {
	const log = isValue(options.log) ? options.log : true;
	delete options.log;
	config = Object(validate(config));

	if (!isValue(options.cache)) options.cache = true;
	return function (req, res, next) {
		const path = parse(req.url).pathname;
		if (!isValue(config[path])) {
			next();
			return;
		}

		const promise = webmake(config[path], options, (err, src) => {
			let msg, modulesSize, packagesSize;

			res.writeHead(200, {
				"Content-Type": "text/javascript; charset=utf-8",
				"Cache-Control": "no-cache"
			});

			if (err) {
				// fail loudly on the cli and in the browser
				console.error(`Webmake error: ${ err.message }`);
				res.end(
					errorTpl
						.replace("$PATH", stringify(encode(path)).slice(1, -1))
						.replace("$ERROR", stringify(encode(err.message)).slice(1, -1))
				);
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
				console.log(`${ msg } in ${ (promise.time / 1000).toFixed(2) }s] -> ${ req.url }`);
			}
		});
	};
};
