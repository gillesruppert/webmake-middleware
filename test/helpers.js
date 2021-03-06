"use strict";

const expect = require("expect.js");

exports.successResponseCallback = function (cb, close) {
	return function (res) {
		res.setEncoding("utf8");
		expect(res.statusCode).to.be(200);
		expect(res.headers["content-type"]).to.be("text/javascript; charset=utf-8");
		expect(res.headers["cache-control"]).to.be("no-cache");

		res.on("data", chunk => {
			expect(chunk).to.be.a("string");
			expect(chunk).to.not.be.empty();
		});

		res.on("end", () => {
			if (close) close();
			cb();
		});
	};
};

exports.failureResponseCallback = function (cb, close) {
	return function (res) {
		res.setEncoding("utf8");
		expect(res.statusCode).to.be(200);

		res.on("data", chunk => {
			expect(chunk).to.be.a("string");
			expect(chunk).to.contain("Cannot require");
		});

		res.on("end", () => {
			if (close) close();
			cb();
		});
	};
};
